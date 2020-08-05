# vicmap-tiles
Tile server for vicmap layers


Create a virtual mosaic from all Tiff files:

```
gdalbuildvrt mosaic.vrt c:\data\....\*.tif
gdal_translate -of GTiff -co "COMPRESS=JPEG" -co "PHOTOMETRIC=YCBCR" -co "TILED=YES" mosaic.vrt mosaic.tif
```

