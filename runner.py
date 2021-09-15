import json 
import requests
import os
import signal
import csv
from csv import reader

from progress.bar import FillingSquaresBar 

YOUR_API_KEY = 'AIzaSyBGWD0SEKb58Huav7ilA87x3Osq6-9BjSc'
INPUT_CSV = 'test.csv'
OUTPUT_CSV = 'out.csv'

def url(dLat, dLng):
    return f'https://maps.googleapis.com/maps/api/elevation/json?locations={dLat},{dLng}&key={YOUR_API_KEY}'

def hack_file():

    """
    Take a csv of dLat, dLng decimal points and determine the elevation using the Google Maps API.
    INPUT_CSV: 

        dLat    | dLng 
        -35.67  | 140.56
        ...

    OUTPUT_CSV:

        dLat    | dLng    | elev
        -35.67  | 140.56  | 1608.67
        ...

    YOUR_API_KEY must be set or the thing will fail.
    """

    with open(INPUT_CSV, 'r') as opened:

        csv_reader = reader(opened)
        jobs = []

        for row in csv_reader:
            dLat, dLng = row[0].split('\t')
            if dLat != 'dLat':
                jobs.append((dLat, dLng))
    
        bar = FillingSquaresBar(f"determining elevation of {len(jobs)} points", max=len(jobs))
                
        results = []
        for dLat, dLng in jobs:
            response = requests.get(url(dLat, dLng))
            result = json.loads(response.content)
            if result['status'] != 'OK':
                print(response.content)
                exit(1)
            else:
                results.append((dLat, dLng, result['results'][0]['elevation']))
            bar.next()
        bar.finish()

        print('writing to')
        with open(OUTPUT_CSV, 'w', newline='') as outfile:
            writer = csv.writer(outfile)
            writer.writerow(["dLat", "dLng", "elev"])
            for dLat, dLng, elev in results:
                writer.writerow([f"{dLat}", f"{dLng}", f"{elev}"])

if __name__ == "__main__":
    hack_file()