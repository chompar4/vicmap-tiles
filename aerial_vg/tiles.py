import json 
import grequests
import os
import numpy as np
from pyproj import CRS, Transformer
import rasterio
from rasterio.transform import Affine
from rasterio.merge import merge
import affine

from progress.bar import ChargingBar 

# crs for pyproj
vicgrid94 = CRS.from_epsg(3111)
wgs84 = CRS.from_epsg(4326)
transformer = Transformer.from_crs(vicgrid94, wgs84)

# path to tiles
tilepath = '/Volumes/SAM/vicmap-tiles/aerial_vg/tiles'

class AsyncCallback(grequests.AsyncRequest):
    def __init__(self, method, url, callback, **kwargs):
        super().__init__(method, url, **kwargs)
        self.callback = callback

def map_callback(requests, stream=False, size=None, exception_handler=None, gtimeout=None):
    """Concurrently converts a list of Requests to Responses.
    :param requests: a collection of Request objects.
    :param stream: If True, the content will not be downloaded immediately.
    :param size: Specifies the number of requests to make at a time. If None, no throttling occurs.
    :param exception_handler: Callback function, called when exception occured. Params: Request, Exception
    :param gtimeout: Gevent joinall timeout in seconds. (Note: unrelated to requests timeout)
    """

    requests = list(requests)

    pool = grequests.Pool(size) if size else None
    print('created pool, {} jobs to send'.format(len(requests)))
    jobs = [grequests.send(r, pool, stream=stream) for r in requests]
    print('sent jobs')

    ret = []

    for request in requests:
        if request.response is not None:
            response = request.response
            ret.append(request.response)
            """ 
            HACK - also execute the callback on the request as required 
            """
            request.callback(response)
        elif exception_handler and hasattr(request, 'exception'):
            ret.append(exception_handler(request, request.exception))
        elif exception_handler and not hasattr(request, 'exception'):
            ret.append(exception_handler(request, None))
        else:
            ret.append(None)

    return ret

# handle request info
def handle(writepath, bar):
    def callback(response):
        with open(writepath, 'wb') as q: 
            q.write(response.content)
        bar.next()
    return callback


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

            bar = ChargingBar("Zoom Level: {}".format(zoom), max=rowMax * colMax)

            for x in range(colMax):
                for y in range(rowMax):

                    writepath = tilepath + '/{}/{}-{}.png'.format(zoom, x, y)

                    if not os.path.exists(writepath):

                        # create async request
                        url = 'http://base.maps.vic.gov.au/wmts/AERIAL_VG/EPSG:3111/{}/{}/{}.png'.format(zoom, x, y)
                        callback = handle(writepath, bar)
                        request = AsyncCallback('GET', url, callback)
                        jobs.append(request)
                    
                    else: 
                        bar.next()

            print('finished collecting requests')

            map_callback(jobs, size=5)
            bar.finish()

def batch_georeference(zoom=1):
    
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

                bar = ChargingBar("Zoom Level: {}\n".format(zoom), max=rowMax * colMax)

                nX = colMax - colMin
                nY = rowMax - rowMin

                dX = xExtent / nX
                dY = yExtent / nY

                # georeference individual tiles
                filenames = []
                for colNum in range(colMax):
                    for rowNum in range(rowMax):

                        # (x0, y0) is bottom left corner of tile in vicgrid94
                        x0 = xMin + dX * colNum
                        y0 = yMin + dY * rowNum

                        print("tile z {} , col {}, row {} (x, y): ({}, {})".format(idx, colNum, rowNum, x0, y0))

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
                        crs="+proj=lcc +lat_1=-36 +lat_2=-38 +lat_0=-37 +lon_0=145 +x_0=2500000 +y_0=2500000 +ellps=GRS80 +units=m +no_defs"

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

                        # corner_pts = [
                        #     (j, i)
                        #     for x in pixel_points
                        #     for (i, j) in [new_dataset.transform * (x)]
                        # ]
                        # import ipdb; ipdb.set_trace()

                        for band_idx in dataset.indexes:
                            band = dataset.read(band_idx)
                            new_dataset.write(band, band_idx)                        

                        new_dataset.close()
                        dataset.close()
                        filenames.append(filename + '-new.tif')

                # create merged raster mosaic from all tiles
                to_merge = [
                    rasterio.open(name)
                    for name in filenames
                ]
                
                mosaic, out_transform = merge(to_merge)
                out_meta = to_merge[0].meta.copy()
                out_meta.update({
                    "driver": "GTiff", 
                    "height": mosaic.shape[1], 
                    "width": mosaic.shape[2], 
                    "transform": out_transform, 
                    "crs": crs
                })
                with rasterio.open(tilepath + '/{}/mosiac.tif'.format(idx), "w", **out_meta) as dest:
                    dest.write(mosaic)






def open_raster():

    filename = tilepath + '/0/0-0.png'
    dataset = rasterio.open(filename)


    dLat, dLng = dataset.xy(dataset.height // 2, dataset.width // 2)

    assert round(dLat, 2) == round(-36.64851, 2)

    import ipdb; ipdb.set_trace()


    



if __name__ == "__main__":
    pull_tiles()

    # batch_georeference()

    # open_raster()
    