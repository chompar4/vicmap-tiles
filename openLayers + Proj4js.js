var theMap; 
// Used in the delwp theme to send functions to the map
/*
* Here is a basic map being created. with a couple of extra values. Right at the end I have assigned
* the above theMap global variable to the map that was created.
*/
var gc;
$(function () {
    //proj4.defs("EPSG:3111", "+proj=lcc +lat_1=-36 +lat_2=-38 +lat_0=-37 +lon_0=145 +x_0=2500000 +y_0=2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    Proj4js.defs["EPSG:3111"] = "+proj=lcc +lat_1=-36 +lat_2=-38 +lat_0=-37 +lon_0=145 +x_0=2500000 +y_0=2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
    var url = "//base.maps.vic.gov.au/";
    //var url = "//api.maps.vic.gov.au/geowebcacheWM/service/wmts";
    var att = "Vicmap Basemap Services © " + new Date().getFullYear() + " State Government of Victoria | <a href='https://www2.delwp.vic.gov.au/copyright/' target='_blank' style='color:#4BABFA;'>Copyright and Disclaimer</a> ";
    var p3111 = new OpenLayers.Projection("EPSG:3111");
    var tileExtent = new OpenLayers.Bounds(1786000, 1997264.499195665, 2969010, 3081000);
    var maxEextent = new OpenLayers.Bounds(1786000, 1997264.499195665, 3953471.00160867, 3081000);
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
    var carto_vg_base = new OpenLayers.Layer.XYZ("Vicmap Basemap - Cartographic",
            url + "wmts/CARTO_VG/EPSG:3111/${z}/${x}/${y}.png",
            {
                isBaseLayer: true,
                projection: p3111,
                opacity: 1,
                tileSize: tilesize,
                visibility: false,
                //tileFullExtent: maxEextent
            });
    var overlay_vg_base = new OpenLayers.Layer.XYZ("Vicmap Basemap - Overlay",
            url + "wmts/CARTO_OVERLAY_VG/EPSG:3111/${z}/${x}/${y}.png",
            {
                isBaseLayer: true,
                projection: p3111,
                opacity: 1,
                tileSize: tilesize,
                visibility: false,
                //tileFullExtent: maxEextent
            });
    var aerial_vg_base = new OpenLayers.Layer.XYZ("Vicmap Basemap - Aerial",
            url + "wmts/AERIAL_VG/EPSG:3111/${z}/${x}/${y}.png",
            {
                isBaseLayer: true,
                projection: p3111,
                opacity: 1,
                tileSize: tilesize,
                visibility: false,
                //tileFullExtent: maxEextent
            });
    var aerial_overlay = aerial_vg_base.clone();
    aerial_overlay.isBaseLayer = false;
    aerial_overlay.displayInLayerSwitcher = false;
    aerial_overlay.visibility = false;

    var eventListeners = {
        changebaselayer: function (e) {
            // Pull in the sat_overlay which is a clone of . make it visible, put it under the bottom layer
            if (overlay_vg_base.visibility === true) {
                console.log("fired");
                aerial_overlay.setVisibility(true);
                aerial_overlay.setZIndex(0);
            } else
                aerial_overlay.setVisibility(false); // turn it off when the hybrid is not visible
        }
    };
    theMap = new OpenLayers.Map({
        div: "map",
        eventListeners: eventListeners,
        theme: "../delwp/css/delwp_map_style.css", //add the delwp theme css from where it is located
        layers: [carto_vg_base, overlay_vg_base, aerial_vg_base, aerial_overlay],
        numZoomLevels: 14,
        autoUpdateSize: false,
        resolutions: resosVG,
        projection: p3111,
        maxExtent: tileExtent //settng maxExtent allows the map to use the REST XYZ for the VicGrid tileset
    });
    aerial_overlay.setVisibility(false);
    theMap.addControl(new OpenLayers.Control.ScaleLine());
    //geodesic: true
    //}));
    var ls = new OpenLayers.Control.LayerSwitcher(); // Needed for the settings div/icon to be displayed
    theMap.addControl(ls);// Needed for the settings div/icon to be displayed
    theMap.zoomToExtent([2079450, 2252112, 2969010, 2832149], true);
    //theMap.zoomToExtent(vmapi.maxExtent, true);
    ls.baseLbl.innerText = "CHANGE MAP VIEW";
    //ls.dataLbl.innerText = "OVERLAYS";
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
