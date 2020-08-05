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

var p3111 = getProjection('3111')

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