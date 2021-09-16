import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {applyTransform, getWidth} from 'ol/extent';
import Graticule from 'ol/layer/Graticule';
import TileLayer from 'ol/layer/Tile';
import {TileDebug, XYZ} from 'ol/source';
import {get as getProjection, getTransform, transform} from 'ol/proj';
import {register} from 'ol/proj/proj4';
import OSM from 'ol/source/OSM';
import proj4 from 'proj4';

var p3111 = getProjection('4326')

var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    new TileLayer({
      source: new XYZ({
          url: 'https://base.maps.vic.gov.au/wmts/AERIAL_VG/EPSG:3111/{z}/{x}/{y}.png', 
          proj: p3111
      })
    }),
    new TileLayer({
      source: new TileDebug()
    }), 
  ],
  target: 'map',
  view: new View({
    projection: 'EPSG:4326',
    center: [0, 0],
    zoom: 1
  })
});

Vicgrid94.prototype.toTile = function(resolution) 
{

//	calculate tile

    var tileOriginX = 1786000;
    var tileOriginY = 3081000;
    var zoomLevel = getZoomLevel(resolution);

		var xOffset = this.easting - tileOriginX;
		var yOffset = tileOriginY - this.northing;
		var tilesize = 512 * resolution;
		var tileC = Math.floor(xOffset / tilesize); //- 1;
		var tileR = Math.floor(yOffset / tilesize); //- 1;
		
		var s = "L" + stringNumber(zoomLevel,2) + "/R" + stringNumber(tileR,8,16) + "/C" + stringNumber(tileC,8,16);
		
		
    return  s; 
}

function getZoomLevel (resolution)
{
	  var resolutions = [
        2116.670900008467,
        1058.3354500042335,
        529.1677250021168,
        264.5838625010584,
        132.2919312505292,
        66.1459656252646,
        26.458386250105836,
        13.229193125052918,
        6.614596562526459,
        2.6458386250105836,
        1.3229193125052918,
        0.6614596562526459,
        0.33072982812632296,
        0.21166709000084669,
        -1
	  ];
	  var zoomLevel = 0;
	  while (resolutions[zoomLevel] > 0)
	  {
	  	if (Math.abs(resolution - resolutions[zoomLevel]) < resolutions[zoomLevel]/100)
	  		return zoomLevel;
	  	zoomLevel ++;	
	  }
	
		return zoomLevel;	
}


var code = 3111
var bbox = []
fetch(`https://epsg.io/?format=json&q=${code}`).then(function(response) {
  return response.json();
}).then(function(json) {
  var results = json['results'];
  for (var i = 0, ii = results.length; i < ii; i++) {
    var result = results[i];
    if (result) {
      code = result['code'];
      console.log(result)
      var name = result['name'];
      var proj4def = result['proj4'];
      bbox = result['bbox'];
      if (code && code.length > 0 && proj4def && proj4def.length > 0 &&
          bbox && bbox.length == 4) {
        setProjection(code, name, proj4def, bbox);
        return;
      }
    }
  }
});

function setProjection(code, name, proj4def, bbox) {

  var newProjCode = 'EPSG:' + code;
  proj4.defs(newProjCode, proj4def);
  register(proj4);
  var newProj = getProjection(newProjCode);
  var fromLonLat = getTransform('EPSG:4326', newProj);

  var worldExtent = [bbox[1], bbox[2], bbox[3], bbox[0]];
  newProj.setWorldExtent(worldExtent);

  // approximate calculation of projection extent,
  // checking if the world extent crosses the dateline
  if (bbox[1] > bbox[3]) {
    worldExtent = [bbox[1], bbox[2], bbox[3] + 360, bbox[0]];
  }
  var extent = applyTransform(worldExtent, fromLonLat, undefined, 8);
  newProj.setExtent(extent);
  var newView = new View({
    projection: newProj
  });
  map.setView(newView);
  newView.fit(extent);
}