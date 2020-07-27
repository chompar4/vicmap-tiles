import json 
import requests
import os
import numpy as np
from pyproj import CRS, Transformer
import rasterio

from progress.bar import ChargingBar 

# crs for pyproj
vicgrid94 = CRS.from_epsg(3111)
wgs84 = CRS.from_epsg(4326)
transformer = Transformer.from_crs(vicgrid94, wgs84)

def pull_tiles():
    with open("defs.json", 'r') as p:
        blob = json.load(p)
        
        meta = blob["meta"]

        levels = blob["tile_limits"]

        print(meta)

        for idx, lvl in enumerate(levels): 

            rowMax = lvl["rowMax"]
            colMax = lvl["colMax"]
            zoom = lvl["level"]

            bar = ChargingBar("Zoom Level: {}".format(zoom), max=rowMax * colMax)

            for x in range(colMax):
                for y in range(rowMax):

                    writepath = '/Volumes/SAM/vicmap-tiles/aerial_vg/tiles/{}/{}-{}.png'.format(zoom, x, y)

                    if not os.path.exists(writepath):

                        # get the tile
                        url = 'http://base.maps.vic.gov.au/wmts/AERIAL_VG/EPSG:3111/{}/{}/{}.png'.format(zoom, x, y)
                        r = requests.get(url, allow_redirects=True)

                        
                        # write content to file
                        with open(writepath, 'wb') as q: 
                            q.write(r.content)

                    bar.next()

            bar.finish()

def batch_georeference(zoom=0):
    
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
                            (x1, y0),
                            (x1, y1),
                            (E, N)
                        ]

                        for (X, Y) in grid_points:
                            # convert to geo coords
                            dLat, dLng = transformer.transform(X, Y)
                            print(dLat, dLng)

                            # convert to pixel coords
                            # origin is upper left corner


                            # geofereence 





            
                bar.finish()

def open_raster():

    filename = '/Volumes/SAM/vicmap-tiles/aerial_vg/tiles/0/0-0.png'
    dataset = rasterio.open(filename)


    dLat, dLng = dataset.xy(dataset.height // 2, dataset.width // 2)

    assert round(dLat, 2) == round(-36.64851, 2)

    import ipdb; ipdb.set_trace()


    



if __name__ == "__main__":
    # pull_tiles()

    batch_georeference()

    # open_raster()
    