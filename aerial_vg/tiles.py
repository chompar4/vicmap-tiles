import json 
import requests
import os
import numpy as np
from pyproj import CRS, Transformer
import rasterio
import signal
from functools import partial
from rasterio.transform import Affine
from merge import merge
import affine
import multiprocessing as mp

from progress.bar import FillingSquaresBar 

# crs for pyproj
vicgrid94 = CRS.from_epsg(3111)
wgs84 = CRS.from_epsg(4326)
transformer = Transformer.from_crs(vicgrid94, wgs84)

# path to tiles
tilepath = '/Volumes/SAM/vicmap-tiles/aerial_vg/tiles'

def cleanup(_signo, _frame, _pool=None):
    log.warning("received {}: cleaning up {}".format(_signo, _pool))
    try:
        _pool.terminate()
    except AttributeError:
        pass
    sys.exit(_signo)

def callback(chunk):
    bar = FillingSquaresBar("\t ", max=len(chunk))
    for (url, writepath) in chunk:
        response = requests.get(url, allow_redirects=True)
        with open(writepath, 'wb') as q: 
            q.write(response.content)
        bar.next()
    bar.finish()


def pull_tiles():

    with open("defs.json", 'r') as p:
        blob = json.load(p)

        meta = blob["meta"]
        levels = blob["tile_limits"]

        print(meta)

        for idx, lvl in enumerate(levels): 

            jobs = []

            rowMax = lvl["rowMax"]
            colMax = lvl["colMax"]
            zoom = lvl["level"]


            bar = FillingSquaresBar("creating requests z: {}".format(zoom), max=rowMax * colMax)

            for x in range(colMax):
                for y in range(rowMax):

                    writepath = tilepath + '/{}/{}-{}.png'.format(zoom, x, y)

                    if not os.path.exists(writepath):

                        # create async request
                        url = 'http://base.maps.vic.gov.au/wmts/AERIAL_VG/EPSG:3111/{}/{}/{}.png'.format(zoom, x, y)
                        jobs.append((url, writepath))
                        bar.next()
                    
                    else: 
                        bar.next()

            # run in multiproc mode
            if jobs:
                nprocs= mp.cpu_count() - 1
                chunk_size = int(len(jobs) / nprocs)
                chunks = [
                    jobs[i:i+chunk_size]
                    for i in range(0, len(jobs), chunk_size)
                ]
                pool = mp.Pool(processes=nprocs, maxtasksperchild=5)
                _cleanup = partial(cleanup, _pool=pool)
                signal.signal(signal.SIGTERM, _cleanup)
                results = pool.map(callback, chunks, 1)
                pool.close()
                pool.join()

def batch_georeference(zoom=3):
    
    with open("defs.json", 'r') as p:
        blob = json.load(p)
        
        meta = blob["meta"]

        xMin = meta["XMin"]
        xMax = meta["XMax"]
        yMin = meta["YMin"]
        yMax = meta["YMax"]

        xExtent = xMax - xMin # metres
        yExtent = yMax - yMin # metres

        levels = blob["tile_limits"]

        print(meta)

        for idx, lvl in enumerate(levels): 

            if idx == zoom:

                rowMin = lvl["rowMin"]
                rowMax = lvl["rowMax"]
                colMin = lvl["colMin"]
                colMax = lvl["colMax"]
                zoom = lvl["level"]

                nX = colMax - colMin
                nY = rowMax - rowMin

                dX = xExtent / nX
                dY = yExtent / nY

                # georeference individual tiles
                filenames = []
                for rowNum in range(rowMax):
                    bar = FillingSquaresBar("row: {} of {} z: {}".format(rowNum, rowMax, zoom), max=colMax)
                    for colNum in range(colMax):

                        # (x0, y0) is bottom left corner of tile in vicgrid94
                        x0 = xMin + dX * colNum
                        y0 = yMin + dY * rowNum

                        # center of tile
                        E = x0 + dX / 2
                        N = y0 + dY / 2

                        # (x1, y1) is upper right corner of tile
                        x1 = x0 + dX
                        y1 = y0 + dY

                        # we use (x0, y0) to determine E, N, but they are not the corners of the image.

                        scale = lvl["scale"]

                        # now have 5 points for georeferencing
                        grid_points = [
                            (x0, y0),
                            (x0, y1),
                            (E, N),
                            (x1, y0),
                            (x1, y1),
                        ]

                        # transform to lat lng in wgs84
                        # geo_points = [
                        #     transformer.transform(X, Y)
                        #     for X, Y in grid_points
                        # ]

                        geo_points = grid_points

                        # pixel coords
                        height = meta["tileHeightPx"]
                        width = meta["tileWidthPx"]

                        # corrent png convention (upper left is (0, 0) lower left is (0, 512))
                        # pixel_points = [
                        #     (0, 512),
                        #     (0, 0),
                        #     (512, 512),
                        #     (0, 512),
                        #     (256, 256)
                        # ]

                        # vicgrid tiles (FFS) (upper left is (0, 0) lower left is (512, 0))
                        pixel_points = [
                            (512, 0),
                            (0, 0),
                            (256, 256),
                            (512, 512),
                            (512, 0),
                        ]

                        # swap x & y for georeferencing 
                        pixel_points = [
                            (y, x) for (x, y) in list(pixel_points)
                        ]
                        # geo_points = [
                        #     (y, x) for (x, y) in list(geo_points)
                        # ]
                        # grid_points = [
                        #     (y, x) for (x, y) in list(grid_points)
                        # ]

                        # define affine transformation
                        # note: affine transformation only holds in grid coords
                        # The 3x3 augmented affine transformation matrix for transformations in two
                        # dimensions is illustrated below.

                        # | x' |   | a  b  c | | x |
                        # | y' | = | d  e  f | | y |
                        # | 1  |   | 0  0  1 | | 1 |


                        #  giving system of equations
                        # 1 ) x' = ax + by + c
                        # 2 ) y' = dx + ey + f

                        # solve for a, b, c
                        A = np.array([
                            [dLat, dLng, 1] # (x, y, 1)
                            for (dLat, dLng) in pixel_points[0:3]
                        ])
                        invA = np.linalg.inv(A)

                        lhs = [[pt[0]] for pt in geo_points[0:3]]

                        (a, b, c) = invA.dot(lhs)

                        # solve for d, e, f 
                        lhs = [[pt[1]] for pt in geo_points[0:3]]

                        (d, e, f) = invA.dot(lhs)

                        # index row numbers
                        rowIdx = (rowMax - 1) - rowNum
                        colIdx = colNum

                        # write to file
                        filename = tilepath + '/{}/{}-{}'.format(idx, colIdx, rowIdx)
                        dataset = rasterio.open(filename + '.png')
                        transform = Affine(a, b, c, d, e, f)

                        # define crs
                        # crs='+proj=latlong'
                        crs="+proj=lcc +lat_1=-36 +lat_2=-38 +lat_0=-37 +lon_0=145 +x_0=2500000 +y_0=-2500000 +ellps=GRS80 +units=m +no_defs"

                        # write geotiff georeferenced in VICGRID coords
                        new_dataset = rasterio.open(
                            filename + '-new.tif',
                            'w',
                            driver='GTiff', 
                            transform=transform, 
                            crs=crs, 
                            height=dataset.height, 
                            width=dataset.width, 
                            count=dataset.count, 
                            dtype=dataset.read(1).dtype,
                            )

                        for band_idx in dataset.indexes:
                            band = dataset.read(band_idx)
                            new_dataset.write(band, band_idx)                        

                        new_dataset.close()
                        dataset.close()
                        filenames.append(filename + '-new.tif')

                        bar.next()
                
                    bar.finish()

                # create merged raster mosaic from all tiles
                
                mosaic, out_transform = merge(filenames)
                out_meta = rasterio.open(filenames[0]).meta.copy()
                out_meta.update({
                    "driver": "GTiff", 
                    "height": mosaic.shape[1], 
                    "width": mosaic.shape[2], 
                    "transform": out_transform, 
                    "crs": crs
                })
                pth = tilepath + '/{}/mosiac.tif'.format(idx)
                with rasterio.open(pth, "w", **out_meta) as dest:
                    dest.write(mosaic)

                print('file written to {}'.format(pth))

                






def open_raster():

    filename = tilepath + '/0/0-0.png'
    dataset = rasterio.open(filename)


    dLat, dLng = dataset.xy(dataset.height // 2, dataset.width // 2)

    assert round(dLat, 2) == round(-36.64851, 2)

    import ipdb; ipdb.set_trace()


    



if __name__ == "__main__":
    # pull_tiles()

    batch_georeference()

    # open_raster()
    