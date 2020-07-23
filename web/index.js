var theMap; 
// Used in the delwp theme to send functions to the map
/*
* Here is a basic map being created. with a couple of extra values. Right at the end I have assigned
* the above theMap global variable to the map that was created.
*/
var gc;
$(function () {
    Proj4js.defs["EPSG:3111"] = "+proj=lcc +lat_1=-36 +lat_2=-38 +lat_0=-37 +lon_0=145 +x_0=2500000 +y_0=2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
    // Proj4js.defs["EPSG:4326"] = '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees';
    
    
    var aerial_url = "//base.maps.vic.gov.au/wmts/AERIAL_VG/EPSG:3111/${z}/${x}/${y}.png";
    var carto_url = "http://mt0.google.com/vt/lyrs=p&hl=en&x=${x}&y=${y}&z=${z}";
    var p3111 = new OpenLayers.Projection("EPSG:3111");
    // var p4326 = new OpenLayers.Projection("EPSG:4326");
    var tileExtent = new OpenLayers.Bounds(1786000, 1997264.499195665, 2969010, 3081000);
    var tilesize = new OpenLayers.Size(512, 512);
    var resosVG = [
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
        0.330729828126323,
        0.2116670900008467
    ];
    var carto_base = new OpenLayers.Layer.XYZ("Vic Emergency Map",
            carto_url,
            {
                isBaseLayer: true,
                projection: p3111,
                opacity: 1,
                tileSize: tilesize,
                visibility: false,
            });
    var aerial_vg_base = new OpenLayers.Layer.XYZ("Vicmap Basemap - Aerial",
            aerial_url,
            {
                isBaseLayer: false,
                projection: p3111,
                opacity: 1,
                tileSize: tilesize,
                visibility: false,
            });

    var debug_layer = new OpenLayers.TileDebug()

    theMap = new OpenLayers.Map({
        div: "map",
        theme: "../deps/css/delwp_map_style.css", //add the delwp theme css from where it is located
        layers: [debug_layer, carto_base, aerial_vg_base],
        numZoomLevels: 14,
        autoUpdateSize: false,
        resolutions: resosVG,
        projection: p3111,
        maxExtent: tileExtent //settng maxExtent allows the map to use the REST XYZ for the VicGrid tileset
    });
    theMap.addControl(new OpenLayers.Control.ScaleLine());
    var ls = new OpenLayers.Control.LayerSwitcher(); // Needed for the settings div/icon to be displayed
    theMap.addControl(ls);// Needed for the settings div/icon to be displayed
    theMap.zoomToExtent([-80, 80, -80, 80], true);
    ls.baseLbl.innerText = "CHANGE LAYER";
});
window.onresize = function () {
    setTimeout(function () {
        theMap.updateSize();
    }, 200);
};
function matrixIds(name, l) {
    var matrixids = new Array(l);
    for (var i = 0; i <= l - 1; ++i) {
        matrixids[i] = name + ":" + i;
    }
    return matrixids;
}
