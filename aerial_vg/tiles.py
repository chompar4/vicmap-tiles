import json 
import requests
import os

from progress.bar import ChargingBar 


if __name__ == "__main__":
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

                    writepath = 'tiles/{}/{}-{}.png'.format(zoom, x, y)

                    if not os.path.exists(writepath):

                        # get the tile
                        url = 'http://base.maps.vic.gov.au/wmts/AERIAL_VG/EPSG:3111/{}/{}/{}.png'.format(zoom, x, y)
                        r = requests.get(url, allow_redirects=True)

                        
                        # write content to file
                        with open(writepath, 'wb') as q: 
                            q.write(r.content)

                    bar.next()

            bar.finish()