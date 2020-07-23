import json 
import requests
import os


if __name__ == "__main__":
    with open("defs.json", 'r') as p:
        blob = json.load(p)
        
        meta = blob["meta"]

        levels = blob["tile_limits"]

        print(meta)

        for lvl in levels: 

            rowMax = lvl["rowMax"]
            colMax = lvl["colMax"]
            zoom = lvl["level"]

            print('zoom: {}, rows: {}, cols: {}'.format(zoom, rowMax, colMax))

            for x in range(colMax):
                for y in range(rowMax):

                    # get the tile
                    url = 'http://base.maps.vic.gov.au/wmts/AERIAL_VG/EPSG:3111/{}/{}/{}.png'.format(zoom, x, y)
                    r = requests.get(url, allow_redirects=True)

                    writepath = 'tiles/{}-{}-{}.png'.format(zoom, x, y)

                    with open(writepath, 'wb') as q: 
                        q.write(r.content)

            break