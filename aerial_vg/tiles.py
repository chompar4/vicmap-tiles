import json 
import numpy as np


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

            print(zoom, rowMax, rowMin)

            for x in range(rowMax + 1):
                for x in range(colMax + 1):

                    # get the tile


            break