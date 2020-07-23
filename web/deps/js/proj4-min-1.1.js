function phi4z(e, t, i, n, r, s, o, a, l) {
    var h, c, u, d, p, f, m, g, y, v;
    for (l = s,
    v = 1; 15 >= v; v++)
        if (h = Math.sin(l),
        u = Math.tan(l),
        a = u * Math.sqrt(1 - e * h * h),
        c = Math.sin(2 * l),
        d = t * l - i * c + n * Math.sin(4 * l) - r * Math.sin(6 * l),
        p = t - 2 * i * Math.cos(2 * l) + 4 * n * Math.cos(4 * l) - 6 * r * Math.cos(6 * l),
        f = 2 * d + a * (d * d + o) - 2 * s * (a * d + 1),
        m = e * c * (d * d + o - 2 * s * d) / (2 * a),
        g = 2 * (s - d) * (a * p - 2 / c) - 2 * p,
        y = f / (m + g),
        l += y,
        1e-10 >= Math.abs(y))
            return l;
    return Proj4js.reportError("phi4z: No convergence"),
    null
}
function e4fn(e) {
    var t, i;
    return t = 1 + e,
    i = 1 - e,
    Math.sqrt(Math.pow(t, t) * Math.pow(i, i))
}
var Proj4js = {
    defaultDatum: "WGS84",
    transform: function(e, t, i) {
        if (!e.readyToUse)
            return this.reportError("Proj4js initialization for:" + e.srsCode + " not yet complete"),
            i;
        if (!t.readyToUse)
            return this.reportError("Proj4js initialization for:" + t.srsCode + " not yet complete"),
            i;
        if (e.datum && t.datum && ((e.datum.datum_type == Proj4js.common.PJD_3PARAM || e.datum.datum_type == Proj4js.common.PJD_7PARAM) && "WGS84" != t.datumCode || (t.datum.datum_type == Proj4js.common.PJD_3PARAM || t.datum.datum_type == Proj4js.common.PJD_7PARAM) && "WGS84" != e.datumCode)) {
            var n = Proj4js.WGS84;
            this.transform(e, n, i),
            e = n
        }
        return "enu" != e.axis && this.adjust_axis(e, !1, i),
        "longlat" == e.projName ? (i.x *= Proj4js.common.D2R,
        i.y *= Proj4js.common.D2R) : (e.to_meter && (i.x *= e.to_meter,
        i.y *= e.to_meter),
        e.inverse(i)),
        e.from_greenwich && (i.x += e.from_greenwich),
        i = this.datum_transform(e.datum, t.datum, i),
        t.from_greenwich && (i.x -= t.from_greenwich),
        "longlat" == t.projName ? (i.x *= Proj4js.common.R2D,
        i.y *= Proj4js.common.R2D) : (t.forward(i),
        t.to_meter && (i.x /= t.to_meter,
        i.y /= t.to_meter)),
        "enu" != t.axis && this.adjust_axis(t, !0, i),
        i
    },
    datum_transform: function(e, t, i) {
        return e.compare_datums(t) ? i : e.datum_type == Proj4js.common.PJD_NODATUM || t.datum_type == Proj4js.common.PJD_NODATUM ? i : ((e.es != t.es || e.a != t.a || e.datum_type == Proj4js.common.PJD_3PARAM || e.datum_type == Proj4js.common.PJD_7PARAM || t.datum_type == Proj4js.common.PJD_3PARAM || t.datum_type == Proj4js.common.PJD_7PARAM) && (e.geodetic_to_geocentric(i),
        (e.datum_type == Proj4js.common.PJD_3PARAM || e.datum_type == Proj4js.common.PJD_7PARAM) && e.geocentric_to_wgs84(i),
        (t.datum_type == Proj4js.common.PJD_3PARAM || t.datum_type == Proj4js.common.PJD_7PARAM) && t.geocentric_from_wgs84(i),
        t.geocentric_to_geodetic(i)),
        i)
    },
    adjust_axis: function(e, t, i) {
        for (var n, r, s = i.x, o = i.y, a = i.z || 0, l = 0; 3 > l; l++)
            if (!t || 2 != l || void 0 !== i.z)
                switch (0 == l ? (n = s,
                r = "x") : 1 == l ? (n = o,
                r = "y") : (n = a,
                r = "z"),
                e.axis[l]) {
                case "e":
                    i[r] = n;
                    break;
                case "w":
                    i[r] = -n;
                    break;
                case "n":
                    i[r] = n;
                    break;
                case "s":
                    i[r] = -n;
                    break;
                case "u":
                    void 0 !== i[r] && (i.z = n);
                    break;
                case "d":
                    void 0 !== i[r] && (i.z = -n);
                    break;
                default:
                    return alert("ERROR: unknow axis (" + e.axis[l] + ") - check definition of " + e.projName),
                    null
                }
        return i
    },
    reportError: function() {},
    extend: function(e, t) {
        if (e = e || {},
        t)
            for (var i in t) {
                var n = t[i];
                void 0 !== n && (e[i] = n)
            }
        return e
    },
    Class: function() {
        for (var e, t = function() {
            this.initialize.apply(this, arguments)
        }, i = {}, n = 0; arguments.length > n; ++n)
            e = "function" == typeof arguments[n] ? arguments[n].prototype : arguments[n],
            Proj4js.extend(i, e);
        return t.prototype = i,
        t
    },
    bind: function(e, t) {
        var i = Array.prototype.slice.apply(arguments, [2]);
        return function() {
            var n = i.concat(Array.prototype.slice.apply(arguments, [0]));
            return e.apply(t, n)
        }
    },
    scriptName: "proj4js-compressed.js",
    defsLookupService: "http://spatialreference.org/ref",
    libPath: null,
    getScriptLocation: function() {
        if (this.libPath)
            return this.libPath;
        for (var e = this.scriptName, t = e.length, i = document.getElementsByTagName("script"), n = 0; i.length > n; n++) {
            var r = i[n].getAttribute("src");
            if (r) {
                var s = r.lastIndexOf(e);
                if (s > -1 && s + t == r.length) {
                    this.libPath = r.slice(0, -t);
                    break
                }
            }
        }
        return this.libPath || ""
    },
    loadScript: function(e, t, i, n) {
        var r = document.createElement("script");
        r.defer = !1,
        r.type = "text/javascript",
        r.id = e,
        r.src = e,
        r.onload = t,
        r.onerror = i,
        r.loadCheck = n,
        /MSIE/.test(navigator.userAgent) && (r.onreadystatechange = this.checkReadyState),
        document.getElementsByTagName("head")[0].appendChild(r)
    },
    checkReadyState: function() {
        "loaded" == this.readyState && (this.loadCheck() ? this.onload() : this.onerror())
    }
};
Proj4js.Proj = Proj4js.Class({
    readyToUse: !1,
    title: null,
    projName: null,
    units: null,
    datum: null,
    x0: 0,
    y0: 0,
    localCS: !1,
    queue: null,
    initialize: function(e, t) {
        if (this.srsCodeInput = e,
        this.queue = [],
        t && this.queue.push(t),
        e.indexOf("GEOGCS") >= 0 || e.indexOf("GEOCCS") >= 0 || e.indexOf("PROJCS") >= 0 || e.indexOf("LOCAL_CS") >= 0)
            return this.parseWKT(e),
            this.deriveConstants(),
            this.loadProjCode(this.projName),
            void 0;
        if (0 == e.indexOf("urn:")) {
            var i = e.split(":");
            "ogc" != i[1] && "x-ogc" != i[1] || "def" != i[2] || "crs" != i[3] || (e = i[4] + ":" + i[i.length - 1])
        } else if (0 == e.indexOf("http://")) {
            var n = e.split("#");
            n[0].match(/epsg.org/) ? e = "EPSG:" + n[1] : n[0].match(/RIG.xml/) && (e = "IGNF:" + n[1])
        }
        this.srsCode = e.toUpperCase(),
        0 == this.srsCode.indexOf("EPSG") ? (this.srsCode = this.srsCode,
        this.srsAuth = "epsg",
        this.srsProjNumber = this.srsCode.substring(5)) : 0 == this.srsCode.indexOf("IGNF") ? (this.srsCode = this.srsCode,
        this.srsAuth = "IGNF",
        this.srsProjNumber = this.srsCode.substring(5)) : 0 == this.srsCode.indexOf("CRS") ? (this.srsCode = this.srsCode,
        this.srsAuth = "CRS",
        this.srsProjNumber = this.srsCode.substring(4)) : (this.srsAuth = "",
        this.srsProjNumber = this.srsCode),
        this.loadProjDefinition()
    },
    loadProjDefinition: function() {
        if (Proj4js.defs[this.srsCode])
            return this.defsLoaded(),
            void 0;
        var e = Proj4js.getScriptLocation() + "defs/" + this.srsAuth.toUpperCase() + this.srsProjNumber + ".js";
        Proj4js.loadScript(e, Proj4js.bind(this.defsLoaded, this), Proj4js.bind(this.loadFromService, this), Proj4js.bind(this.checkDefsLoaded, this))
    },
    loadFromService: function() {
        var e = Proj4js.defsLookupService + "/" + this.srsAuth + "/" + this.srsProjNumber + "/proj4js/";
        Proj4js.loadScript(e, Proj4js.bind(this.defsLoaded, this), Proj4js.bind(this.defsFailed, this), Proj4js.bind(this.checkDefsLoaded, this))
    },
    defsLoaded: function() {
        this.parseDefs(),
        this.loadProjCode(this.projName)
    },
    checkDefsLoaded: function() {
        return Proj4js.defs[this.srsCode] ? !0 : !1
    },
    defsFailed: function() {
        Proj4js.reportError("failed to load projection definition for: " + this.srsCode),
        Proj4js.defs[this.srsCode] = Proj4js.defs.WGS84,
        this.defsLoaded()
    },
    loadProjCode: function(e) {
        if (Proj4js.Proj[e])
            return this.initTransforms(),
            void 0;
        var t = Proj4js.getScriptLocation() + "projCode/" + e + ".js";
        Proj4js.loadScript(t, Proj4js.bind(this.loadProjCodeSuccess, this, e), Proj4js.bind(this.loadProjCodeFailure, this, e), Proj4js.bind(this.checkCodeLoaded, this, e))
    },
    loadProjCodeSuccess: function(e) {
        Proj4js.Proj[e].dependsOn ? this.loadProjCode(Proj4js.Proj[e].dependsOn) : this.initTransforms()
    },
    loadProjCodeFailure: function(e) {
        Proj4js.reportError("failed to find projection file for: " + e)
    },
    checkCodeLoaded: function(e) {
        return Proj4js.Proj[e] ? !0 : !1
    },
    initTransforms: function() {
        if (Proj4js.extend(this, Proj4js.Proj[this.projName]),
        this.init(),
        this.readyToUse = !0,
        this.queue)
            for (var e; e = this.queue.shift(); )
                e.call(this, this)
    },
    wktRE: /^(\w+)\[(.*)\]$/,
    parseWKT: function(e) {
        var t = e.match(this.wktRE);
        if (t) {
            var i, n = t[1], r = t[2], s = r.split(",");
            i = "TOWGS84" == n.toUpperCase() ? n : s.shift(),
            i = i.replace(/^\"/, ""),
            i = i.replace(/\"$/, "");
            for (var o = [], a = 0, l = "", h = 0; s.length > h; ++h) {
                for (var c = s[h], u = 0; c.length > u; ++u)
                    "[" == c.charAt(u) && ++a,
                    "]" == c.charAt(u) && --a;
                l += c,
                0 === a ? (o.push(l),
                l = "") : l += ","
            }
            switch (n) {
            case "LOCAL_CS":
                this.projName = "identity",
                this.localCS = !0,
                this.srsCode = i;
                break;
            case "GEOGCS":
                this.projName = "longlat",
                this.geocsCode = i,
                this.srsCode || (this.srsCode = i);
                break;
            case "PROJCS":
                this.srsCode = i;
                break;
            case "GEOCCS":
                break;
            case "PROJECTION":
                this.projName = Proj4js.wktProjections[i];
                break;
            case "DATUM":
                this.datumName = i;
                break;
            case "LOCAL_DATUM":
                this.datumCode = "none";
                break;
            case "SPHEROID":
                this.ellps = i,
                this.a = parseFloat(o.shift()),
                this.rf = parseFloat(o.shift());
                break;
            case "PRIMEM":
                this.from_greenwich = parseFloat(o.shift());
                break;
            case "UNIT":
                this.units = i,
                this.unitsPerMeter = parseFloat(o.shift());
                break;
            case "PARAMETER":
                var d = i.toLowerCase()
                  , p = parseFloat(o.shift());
                switch (d) {
                case "false_easting":
                    this.x0 = p;
                    break;
                case "false_northing":
                    this.y0 = p;
                    break;
                case "scale_factor":
                    this.k0 = p;
                    break;
                case "central_meridian":
                    this.long0 = p * Proj4js.common.D2R;
                    break;
                case "latitude_of_origin":
                    this.lat0 = p * Proj4js.common.D2R;
                    break;
                case "more_here":
                    break;
                default:
                }
                break;
            case "TOWGS84":
                this.datum_params = o;
                break;
            case "AXIS":
                var d = i.toLowerCase()
                  , p = o.shift();
                switch (p) {
                case "EAST":
                    p = "e";
                    break;
                case "WEST":
                    p = "w";
                    break;
                case "NORTH":
                    p = "n";
                    break;
                case "SOUTH":
                    p = "s";
                    break;
                case "UP":
                    p = "u";
                    break;
                case "DOWN":
                    p = "d";
                    break;
                case "OTHER":
                default:
                    p = " "
                }
                switch (this.axis || (this.axis = "enu"),
                d) {
                case "x":
                    this.axis = p + this.axis.substr(1, 2);
                    break;
                case "y":
                    this.axis = this.axis.substr(0, 1) + p + this.axis.substr(2, 1);
                    break;
                case "z":
                    this.axis = this.axis.substr(0, 2) + p;
                    break;
                default:
                }
            case "MORE_HERE":
                break;
            default:
            }
            for (var h = 0; o.length > h; ++h)
                this.parseWKT(o[h])
        }
    },
    parseDefs: function() {
        this.defData = Proj4js.defs[this.srsCode];
        var e, t;
        if (this.defData) {
            for (var i = this.defData.split("+"), n = 0; i.length > n; n++) {
                var r = i[n].split("=");
                switch (e = r[0].toLowerCase(),
                t = r[1],
                e.replace(/\s/gi, "")) {
                case "":
                    break;
                case "title":
                    this.title = t;
                    break;
                case "proj":
                    this.projName = t.replace(/\s/gi, "");
                    break;
                case "units":
                    this.units = t.replace(/\s/gi, "");
                    break;
                case "datum":
                    this.datumCode = t.replace(/\s/gi, "");
                    break;
                case "nadgrids":
                    this.nagrids = t.replace(/\s/gi, "");
                    break;
                case "ellps":
                    this.ellps = t.replace(/\s/gi, "");
                    break;
                case "a":
                    this.a = parseFloat(t);
                    break;
                case "b":
                    this.b = parseFloat(t);
                    break;
                case "rf":
                    this.rf = parseFloat(t);
                    break;
                case "lat_0":
                    this.lat0 = t * Proj4js.common.D2R;
                    break;
                case "lat_1":
                    this.lat1 = t * Proj4js.common.D2R;
                    break;
                case "lat_2":
                    this.lat2 = t * Proj4js.common.D2R;
                    break;
                case "lat_ts":
                    this.lat_ts = t * Proj4js.common.D2R;
                    break;
                case "lon_0":
                    this.long0 = t * Proj4js.common.D2R;
                    break;
                case "alpha":
                    this.alpha = parseFloat(t) * Proj4js.common.D2R;
                    break;
                case "lonc":
                    this.longc = t * Proj4js.common.D2R;
                    break;
                case "x_0":
                    this.x0 = parseFloat(t);
                    break;
                case "y_0":
                    this.y0 = parseFloat(t);
                    break;
                case "k_0":
                    this.k0 = parseFloat(t);
                    break;
                case "k":
                    this.k0 = parseFloat(t);
                    break;
                case "r_a":
                    this.R_A = !0;
                    break;
                case "zone":
                    this.zone = parseInt(t, 10);
                    break;
                case "south":
                    this.utmSouth = !0;
                    break;
                case "towgs84":
                    this.datum_params = t.split(",");
                    break;
                case "to_meter":
                    this.to_meter = parseFloat(t);
                    break;
                case "from_greenwich":
                    this.from_greenwich = t * Proj4js.common.D2R;
                    break;
                case "pm":
                    t = t.replace(/\s/gi, ""),
                    this.from_greenwich = Proj4js.PrimeMeridian[t] ? Proj4js.PrimeMeridian[t] : parseFloat(t),
                    this.from_greenwich *= Proj4js.common.D2R;
                    break;
                case "axis":
                    t = t.replace(/\s/gi, "");
                    var s = "ewnsud";
                    3 == t.length && -1 != s.indexOf(t.substr(0, 1)) && -1 != s.indexOf(t.substr(1, 1)) && -1 != s.indexOf(t.substr(2, 1)) && (this.axis = t);
                    break;
                case "no_defs":
                    break;
                default:
                }
            }
            this.deriveConstants()
        }
    },
    deriveConstants: function() {
        if ("@null" == this.nagrids && (this.datumCode = "none"),
        this.datumCode && "none" != this.datumCode) {
            var e = Proj4js.Datum[this.datumCode];
            e && (this.datum_params = e.towgs84 ? e.towgs84.split(",") : null,
            this.ellps = e.ellipse,
            this.datumName = e.datumName ? e.datumName : this.datumCode)
        }
        if (!this.a) {
            var t = Proj4js.Ellipsoid[this.ellps] ? Proj4js.Ellipsoid[this.ellps] : Proj4js.Ellipsoid.WGS84;
            Proj4js.extend(this, t)
        }
        this.rf && !this.b && (this.b = (1 - 1 / this.rf) * this.a),
        (0 === this.rf || Math.abs(this.a - this.b) < Proj4js.common.EPSLN) && (this.sphere = !0,
        this.b = this.a),
        this.a2 = this.a * this.a,
        this.b2 = this.b * this.b,
        this.es = (this.a2 - this.b2) / this.a2,
        this.e = Math.sqrt(this.es),
        this.R_A && (this.a *= 1 - this.es * (Proj4js.common.SIXTH + this.es * (Proj4js.common.RA4 + this.es * Proj4js.common.RA6)),
        this.a2 = this.a * this.a,
        this.b2 = this.b * this.b,
        this.es = 0),
        this.ep2 = (this.a2 - this.b2) / this.b2,
        this.k0 || (this.k0 = 1),
        this.axis || (this.axis = "enu"),
        this.datum = new Proj4js.datum(this)
    }
}),
Proj4js.Proj.longlat = {
    init: function() {},
    forward: function(e) {
        return e
    },
    inverse: function(e) {
        return e
    }
},
Proj4js.Proj.identity = Proj4js.Proj.longlat,
Proj4js.defs = {
    WGS84: "+title=long/lat:WGS84 +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees",
    "EPSG:4326": "+title=long/lat:WGS84 +proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84 +units=degrees",
    "EPSG:4269": "+title=long/lat:NAD83 +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees",
    "EPSG:3875": "+title= Google Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs"
},
Proj4js.defs["EPSG:3785"] = Proj4js.defs["EPSG:3875"],
Proj4js.defs.GOOGLE = Proj4js.defs["EPSG:3875"],
Proj4js.defs["EPSG:900913"] = Proj4js.defs["EPSG:3875"],
Proj4js.defs["EPSG:102113"] = Proj4js.defs["EPSG:3875"],
Proj4js.common = {
    PI: 3.141592653589793,
    HALF_PI: 1.5707963267948966,
    TWO_PI: 6.283185307179586,
    FORTPI: .7853981633974483,
    R2D: 57.29577951308232,
    D2R: .017453292519943295,
    SEC_TO_RAD: 484813681109536e-20,
    EPSLN: 1e-10,
    MAX_ITER: 20,
    COS_67P5: .3826834323650898,
    AD_C: 1.0026,
    PJD_UNKNOWN: 0,
    PJD_3PARAM: 1,
    PJD_7PARAM: 2,
    PJD_GRIDSHIFT: 3,
    PJD_WGS84: 4,
    PJD_NODATUM: 5,
    SRS_WGS84_SEMIMAJOR: 6378137,
    SIXTH: .16666666666666666,
    RA4: .04722222222222222,
    RA6: .022156084656084655,
    RV4: .06944444444444445,
    RV6: .04243827160493827,
    msfnz: function(e, t, i) {
        var n = e * t;
        return i / Math.sqrt(1 - n * n)
    },
    tsfnz: function(e, t, i) {
        var n = e * i
          , r = .5 * e;
        return n = Math.pow((1 - n) / (1 + n), r),
        Math.tan(.5 * (this.HALF_PI - t)) / n
    },
    phi2z: function(e, t) {
        for (var i, n, r = .5 * e, s = this.HALF_PI - 2 * Math.atan(t), o = 0; 15 >= o; o++)
            if (i = e * Math.sin(s),
            n = this.HALF_PI - 2 * Math.atan(t * Math.pow((1 - i) / (1 + i), r)) - s,
            s += n,
            1e-10 >= Math.abs(n))
                return s;
        return alert("phi2z has NoConvergence"),
        -9999
    },
    qsfnz: function(e, t) {
        var i;
        return e > 1e-7 ? (i = e * t,
        (1 - e * e) * (t / (1 - i * i) - .5 / e * Math.log((1 - i) / (1 + i)))) : 2 * t
    },
    asinz: function(e) {
        return Math.abs(e) > 1 && (e = e > 1 ? 1 : -1),
        Math.asin(e)
    },
    e0fn: function(e) {
        return 1 - .25 * e * (1 + e / 16 * (3 + 1.25 * e))
    },
    e1fn: function(e) {
        return .375 * e * (1 + .25 * e * (1 + .46875 * e))
    },
    e2fn: function(e) {
        return .05859375 * e * e * (1 + .75 * e)
    },
    e3fn: function(e) {
        return e * e * e * (35 / 3072)
    },
    mlfn: function(e, t, i, n, r) {
        return e * r - t * Math.sin(2 * r) + i * Math.sin(4 * r) - n * Math.sin(6 * r)
    },
    srat: function(e, t) {
        return Math.pow((1 - e) / (1 + e), t)
    },
    sign: function(e) {
        return 0 > e ? -1 : 1
    },
    adjust_lon: function(e) {
        return e = Math.abs(e) < this.PI ? e : e - this.sign(e) * this.TWO_PI
    },
    adjust_lat: function(e) {
        return e = Math.abs(e) < this.HALF_PI ? e : e - this.sign(e) * this.PI
    },
    latiso: function(e, t, i) {
        if (Math.abs(t) > this.HALF_PI)
            return +Number.NaN;
        if (t == this.HALF_PI)
            return Number.POSITIVE_INFINITY;
        if (t == -1 * this.HALF_PI)
            return -1 * Number.POSITIVE_INFINITY;
        var n = e * i;
        return Math.log(Math.tan((this.HALF_PI + t) / 2)) + e * Math.log((1 - n) / (1 + n)) / 2
    },
    fL: function(e, t) {
        return 2 * Math.atan(e * Math.exp(t)) - this.HALF_PI
    },
    invlatiso: function(e, t) {
        var i = this.fL(1, t)
          , n = 0
          , r = 0;
        do
            n = i,
            r = e * Math.sin(n),
            i = this.fL(Math.exp(e * Math.log((1 + r) / (1 - r)) / 2), t);
        while (Math.abs(i - n) > 1e-12);return i
    },
    sinh: function(e) {
        var t = Math.exp(e);
        return t = (t - 1 / t) / 2
    },
    cosh: function(e) {
        var t = Math.exp(e);
        return t = (t + 1 / t) / 2
    },
    tanh: function(e) {
        var t = Math.exp(e);
        return t = (t - 1 / t) / (t + 1 / t)
    },
    asinh: function(e) {
        var t = e >= 0 ? 1 : -1;
        return t * Math.log(Math.abs(e) + Math.sqrt(e * e + 1))
    },
    acosh: function(e) {
        return 2 * Math.log(Math.sqrt((e + 1) / 2) + Math.sqrt((e - 1) / 2))
    },
    atanh: function(e) {
        return Math.log((e - 1) / (e + 1)) / 2
    },
    gN: function(e, t, i) {
        var n = t * i;
        return e / Math.sqrt(1 - n * n)
    },
    pj_enfn: function(e) {
        var t = [];
        t[0] = this.C00 - e * (this.C02 + e * (this.C04 + e * (this.C06 + e * this.C08))),
        t[1] = e * (this.C22 - e * (this.C04 + e * (this.C06 + e * this.C08)));
        var i = e * e;
        return t[2] = i * (this.C44 - e * (this.C46 + e * this.C48)),
        i *= e,
        t[3] = i * (this.C66 - e * this.C68),
        t[4] = i * e * this.C88,
        t
    },
    pj_mlfn: function(e, t, i, n) {
        return i *= t,
        t *= t,
        n[0] * e - i * (n[1] + t * (n[2] + t * (n[3] + t * n[4])))
    },
    pj_inv_mlfn: function(e, t, i) {
        for (var n = 1 / (1 - t), r = e, s = Proj4js.common.MAX_ITER; s; --s) {
            var o = Math.sin(r)
              , a = 1 - t * o * o;
            if (a = (this.pj_mlfn(r, o, Math.cos(r), i) - e) * a * Math.sqrt(a) * n,
            r -= a,
            Math.abs(a) < Proj4js.common.EPSLN)
                return r
        }
        return Proj4js.reportError("cass:pj_inv_mlfn: Convergence error"),
        r
    },
    C00: 1,
    C02: .25,
    C04: .046875,
    C06: .01953125,
    C08: .01068115234375,
    C22: .75,
    C44: .46875,
    C46: .013020833333333334,
    C48: .007120768229166667,
    C66: .3645833333333333,
    C68: .005696614583333333,
    C88: .3076171875
},
Proj4js.datum = Proj4js.Class({
    initialize: function(e) {
        if (this.datum_type = Proj4js.common.PJD_WGS84,
        e.datumCode && "none" == e.datumCode && (this.datum_type = Proj4js.common.PJD_NODATUM),
        e && e.datum_params) {
            for (var t = 0; e.datum_params.length > t; t++)
                e.datum_params[t] = parseFloat(e.datum_params[t]);
            (0 != e.datum_params[0] || 0 != e.datum_params[1] || 0 != e.datum_params[2]) && (this.datum_type = Proj4js.common.PJD_3PARAM),
            e.datum_params.length > 3 && (0 != e.datum_params[3] || 0 != e.datum_params[4] || 0 != e.datum_params[5] || 0 != e.datum_params[6]) && (this.datum_type = Proj4js.common.PJD_7PARAM,
            e.datum_params[3] *= Proj4js.common.SEC_TO_RAD,
            e.datum_params[4] *= Proj4js.common.SEC_TO_RAD,
            e.datum_params[5] *= Proj4js.common.SEC_TO_RAD,
            e.datum_params[6] = e.datum_params[6] / 1e6 + 1)
        }
        e && (this.a = e.a,
        this.b = e.b,
        this.es = e.es,
        this.ep2 = e.ep2,
        this.datum_params = e.datum_params)
    },
    compare_datums: function(e) {
        return this.datum_type != e.datum_type ? !1 : this.a != e.a || Math.abs(this.es - e.es) > 5e-11 ? !1 : this.datum_type == Proj4js.common.PJD_3PARAM ? this.datum_params[0] == e.datum_params[0] && this.datum_params[1] == e.datum_params[1] && this.datum_params[2] == e.datum_params[2] : this.datum_type == Proj4js.common.PJD_7PARAM ? this.datum_params[0] == e.datum_params[0] && this.datum_params[1] == e.datum_params[1] && this.datum_params[2] == e.datum_params[2] && this.datum_params[3] == e.datum_params[3] && this.datum_params[4] == e.datum_params[4] && this.datum_params[5] == e.datum_params[5] && this.datum_params[6] == e.datum_params[6] : this.datum_type == Proj4js.common.PJD_GRIDSHIFT || e.datum_type == Proj4js.common.PJD_GRIDSHIFT ? (alert("ERROR: Grid shift transformations are not implemented."),
        !1) : !0
    },
    geodetic_to_geocentric: function(e) {
        var t, i, n, r, s, o, a, l = e.x, h = e.y, c = e.z ? e.z : 0, u = 0;
        if (-Proj4js.common.HALF_PI > h && h > -1.001 * Proj4js.common.HALF_PI)
            h = -Proj4js.common.HALF_PI;
        else if (h > Proj4js.common.HALF_PI && 1.001 * Proj4js.common.HALF_PI > h)
            h = Proj4js.common.HALF_PI;
        else if (-Proj4js.common.HALF_PI > h || h > Proj4js.common.HALF_PI)
            return Proj4js.reportError("geocent:lat out of range:" + h),
            null;
        return l > Proj4js.common.PI && (l -= 2 * Proj4js.common.PI),
        s = Math.sin(h),
        a = Math.cos(h),
        o = s * s,
        r = this.a / Math.sqrt(1 - this.es * o),
        t = (r + c) * a * Math.cos(l),
        i = (r + c) * a * Math.sin(l),
        n = (r * (1 - this.es) + c) * s,
        e.x = t,
        e.y = i,
        e.z = n,
        u
    },
    geocentric_to_geodetic: function(e) {
        var t, i, n, r, s, o, a, l, h, c, u, d, p, f, m, g, y, v = 1e-12, b = v * v, L = 30, x = e.x, C = e.y, w = e.z ? e.z : 0;
        if (p = !1,
        t = Math.sqrt(x * x + C * C),
        i = Math.sqrt(x * x + C * C + w * w),
        v > t / this.a) {
            if (p = !0,
            m = 0,
            v > i / this.a)
                return g = Proj4js.common.HALF_PI,
                y = -this.b,
                void 0
        } else
            m = Math.atan2(C, x);
        n = w / i,
        r = t / i,
        s = 1 / Math.sqrt(1 - this.es * (2 - this.es) * r * r),
        l = r * (1 - this.es) * s,
        h = n * s,
        f = 0;
        do
            f++,
            a = this.a / Math.sqrt(1 - this.es * h * h),
            y = t * l + w * h - a * (1 - this.es * h * h),
            o = this.es * a / (a + y),
            s = 1 / Math.sqrt(1 - o * (2 - o) * r * r),
            c = r * (1 - o) * s,
            u = n * s,
            d = u * l - c * h,
            l = c,
            h = u;
        while (d * d > b && L > f);return g = Math.atan(u / Math.abs(c)),
        e.x = m,
        e.y = g,
        e.z = y,
        e
    },
    geocentric_to_geodetic_noniter: function(e) {
        var t, i, n, r, s, o, a, l, h, c, u, d, p, f, m, g, y, v = e.x, b = e.y, L = e.z ? e.z : 0;
        if (v = parseFloat(v),
        b = parseFloat(b),
        L = parseFloat(L),
        y = !1,
        0 != v)
            t = Math.atan2(b, v);
        else if (b > 0)
            t = Proj4js.common.HALF_PI;
        else if (0 > b)
            t = -Proj4js.common.HALF_PI;
        else if (y = !0,
        t = 0,
        L > 0)
            i = Proj4js.common.HALF_PI;
        else {
            if (!(0 > L))
                return i = Proj4js.common.HALF_PI,
                n = -this.b,
                void 0;
            i = -Proj4js.common.HALF_PI
        }
        return s = v * v + b * b,
        r = Math.sqrt(s),
        o = L * Proj4js.common.AD_C,
        l = Math.sqrt(o * o + s),
        c = o / l,
        d = r / l,
        u = c * c * c,
        a = L + this.b * this.ep2 * u,
        g = r - this.a * this.es * d * d * d,
        h = Math.sqrt(a * a + g * g),
        p = a / h,
        f = g / h,
        m = this.a / Math.sqrt(1 - this.es * p * p),
        n = f >= Proj4js.common.COS_67P5 ? r / f - m : -Proj4js.common.COS_67P5 >= f ? r / -f - m : L / p + m * (this.es - 1),
        0 == y && (i = Math.atan(p / f)),
        e.x = t,
        e.y = i,
        e.z = n,
        e
    },
    geocentric_to_wgs84: function(e) {
        if (this.datum_type == Proj4js.common.PJD_3PARAM)
            e.x += this.datum_params[0],
            e.y += this.datum_params[1],
            e.z += this.datum_params[2];
        else if (this.datum_type == Proj4js.common.PJD_7PARAM) {
            var t = this.datum_params[0]
              , i = this.datum_params[1]
              , n = this.datum_params[2]
              , r = this.datum_params[3]
              , s = this.datum_params[4]
              , o = this.datum_params[5]
              , a = this.datum_params[6]
              , l = a * (e.x - o * e.y + s * e.z) + t
              , h = a * (o * e.x + e.y - r * e.z) + i
              , c = a * (-s * e.x + r * e.y + e.z) + n;
            e.x = l,
            e.y = h,
            e.z = c
        }
    },
    geocentric_from_wgs84: function(e) {
        if (this.datum_type == Proj4js.common.PJD_3PARAM)
            e.x -= this.datum_params[0],
            e.y -= this.datum_params[1],
            e.z -= this.datum_params[2];
        else if (this.datum_type == Proj4js.common.PJD_7PARAM) {
            var t = this.datum_params[0]
              , i = this.datum_params[1]
              , n = this.datum_params[2]
              , r = this.datum_params[3]
              , s = this.datum_params[4]
              , o = this.datum_params[5]
              , a = this.datum_params[6]
              , l = (e.x - t) / a
              , h = (e.y - i) / a
              , c = (e.z - n) / a;
            e.x = l + o * h - s * c,
            e.y = -o * l + h + r * c,
            e.z = s * l - r * h + c
        }
    }
}),
Proj4js.Point = Proj4js.Class({
    initialize: function(e, t, i) {
        if ("object" == typeof e)
            this.x = e[0],
            this.y = e[1],
            this.z = e[2] || 0;
        else if ("string" == typeof e && t === void 0) {
            var n = e.split(",");
            this.x = parseFloat(n[0]),
            this.y = parseFloat(n[1]),
            this.z = parseFloat(n[2]) || 0
        } else
            this.x = e,
            this.y = t,
            this.z = i || 0
    },
    clone: function() {
        return new Proj4js.Point(this.x,this.y,this.z)
    },
    toString: function() {
        return "x=" + this.x + ",y=" + this.y
    },
    toShortString: function() {
        return this.x + ", " + this.y
    }
}),
Proj4js.PrimeMeridian = {
    greenwich: 0,
    lisbon: -9.131906111111,
    paris: 2.337229166667,
    bogota: -74.080916666667,
    madrid: -3.687938888889,
    rome: 12.452333333333,
    bern: 7.439583333333,
    jakarta: 106.807719444444,
    ferro: -17.666666666667,
    brussels: 4.367975,
    stockholm: 18.058277777778,
    athens: 23.7163375,
    oslo: 10.722916666667
},
Proj4js.Ellipsoid = {
    MERIT: {
        a: 6378137,
        rf: 298.257,
        ellipseName: "MERIT 1983"
    },
    SGS85: {
        a: 6378136,
        rf: 298.257,
        ellipseName: "Soviet Geodetic System 85"
    },
    GRS80: {
        a: 6378137,
        rf: 298.257222101,
        ellipseName: "GRS 1980(IUGG, 1980)"
    },
    IAU76: {
        a: 6378140,
        rf: 298.257,
        ellipseName: "IAU 1976"
    },
    airy: {
        a: 6377563.396,
        b: 6356256.91,
        ellipseName: "Airy 1830"
    },
    "APL4.": {
        a: 6378137,
        rf: 298.25,
        ellipseName: "Appl. Physics. 1965"
    },
    NWL9D: {
        a: 6378145,
        rf: 298.25,
        ellipseName: "Naval Weapons Lab., 1965"
    },
    mod_airy: {
        a: 6377340.189,
        b: 6356034.446,
        ellipseName: "Modified Airy"
    },
    andrae: {
        a: 6377104.43,
        rf: 300,
        ellipseName: "Andrae 1876 (Den., Iclnd.)"
    },
    aust_SA: {
        a: 6378160,
        rf: 298.25,
        ellipseName: "Australian Natl & S. Amer. 1969"
    },
    GRS67: {
        a: 6378160,
        rf: 298.247167427,
        ellipseName: "GRS 67(IUGG 1967)"
    },
    bessel: {
        a: 6377397.155,
        rf: 299.1528128,
        ellipseName: "Bessel 1841"
    },
    bess_nam: {
        a: 6377483.865,
        rf: 299.1528128,
        ellipseName: "Bessel 1841 (Namibia)"
    },
    clrk66: {
        a: 6378206.4,
        b: 6356583.8,
        ellipseName: "Clarke 1866"
    },
    clrk80: {
        a: 6378249.145,
        rf: 293.4663,
        ellipseName: "Clarke 1880 mod."
    },
    CPM: {
        a: 6375738.7,
        rf: 334.29,
        ellipseName: "Comm. des Poids et Mesures 1799"
    },
    delmbr: {
        a: 6376428,
        rf: 311.5,
        ellipseName: "Delambre 1810 (Belgium)"
    },
    engelis: {
        a: 6378136.05,
        rf: 298.2566,
        ellipseName: "Engelis 1985"
    },
    evrst30: {
        a: 6377276.345,
        rf: 300.8017,
        ellipseName: "Everest 1830"
    },
    evrst48: {
        a: 6377304.063,
        rf: 300.8017,
        ellipseName: "Everest 1948"
    },
    evrst56: {
        a: 6377301.243,
        rf: 300.8017,
        ellipseName: "Everest 1956"
    },
    evrst69: {
        a: 6377295.664,
        rf: 300.8017,
        ellipseName: "Everest 1969"
    },
    evrstSS: {
        a: 6377298.556,
        rf: 300.8017,
        ellipseName: "Everest (Sabah & Sarawak)"
    },
    fschr60: {
        a: 6378166,
        rf: 298.3,
        ellipseName: "Fischer (Mercury Datum) 1960"
    },
    fschr60m: {
        a: 6378155,
        rf: 298.3,
        ellipseName: "Fischer 1960"
    },
    fschr68: {
        a: 6378150,
        rf: 298.3,
        ellipseName: "Fischer 1968"
    },
    helmert: {
        a: 6378200,
        rf: 298.3,
        ellipseName: "Helmert 1906"
    },
    hough: {
        a: 6378270,
        rf: 297,
        ellipseName: "Hough"
    },
    intl: {
        a: 6378388,
        rf: 297,
        ellipseName: "International 1909 (Hayford)"
    },
    kaula: {
        a: 6378163,
        rf: 298.24,
        ellipseName: "Kaula 1961"
    },
    lerch: {
        a: 6378139,
        rf: 298.257,
        ellipseName: "Lerch 1979"
    },
    mprts: {
        a: 6397300,
        rf: 191,
        ellipseName: "Maupertius 1738"
    },
    new_intl: {
        a: 6378157.5,
        b: 6356772.2,
        ellipseName: "New International 1967"
    },
    plessis: {
        a: 6376523,
        rf: 6355863,
        ellipseName: "Plessis 1817 (France)"
    },
    krass: {
        a: 6378245,
        rf: 298.3,
        ellipseName: "Krassovsky, 1942"
    },
    SEasia: {
        a: 6378155,
        b: 6356773.3205,
        ellipseName: "Southeast Asia"
    },
    walbeck: {
        a: 6376896,
        b: 6355834.8467,
        ellipseName: "Walbeck"
    },
    WGS60: {
        a: 6378165,
        rf: 298.3,
        ellipseName: "WGS 60"
    },
    WGS66: {
        a: 6378145,
        rf: 298.25,
        ellipseName: "WGS 66"
    },
    WGS72: {
        a: 6378135,
        rf: 298.26,
        ellipseName: "WGS 72"
    },
    WGS84: {
        a: 6378137,
        rf: 298.257223563,
        ellipseName: "WGS 84"
    },
    sphere: {
        a: 6370997,
        b: 6370997,
        ellipseName: "Normal Sphere (r=6370997)"
    }
},
Proj4js.Datum = {
    WGS84: {
        towgs84: "0,0,0",
        ellipse: "WGS84",
        datumName: "WGS84"
    },
    GGRS87: {
        towgs84: "-199.87,74.79,246.62",
        ellipse: "GRS80",
        datumName: "Greek_Geodetic_Reference_System_1987"
    },
    NAD83: {
        towgs84: "0,0,0",
        ellipse: "GRS80",
        datumName: "North_American_Datum_1983"
    },
    NAD27: {
        nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
        ellipse: "clrk66",
        datumName: "North_American_Datum_1927"
    },
    potsdam: {
        towgs84: "606.0,23.0,413.0",
        ellipse: "bessel",
        datumName: "Potsdam Rauenberg 1950 DHDN"
    },
    carthage: {
        towgs84: "-263.0,6.0,431.0",
        ellipse: "clark80",
        datumName: "Carthage 1934 Tunisia"
    },
    hermannskogel: {
        towgs84: "653.0,-212.0,449.0",
        ellipse: "bessel",
        datumName: "Hermannskogel"
    },
    ire65: {
        towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
        ellipse: "mod_airy",
        datumName: "Ireland 1965"
    },
    nzgd49: {
        towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
        ellipse: "intl",
        datumName: "New Zealand Geodetic Datum 1949"
    },
    OSGB36: {
        towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
        ellipse: "airy",
        datumName: "Airy 1830"
    }
},
Proj4js.WGS84 = new Proj4js.Proj("WGS84"),
Proj4js.Datum.OSB36 = Proj4js.Datum.OSGB36,
Proj4js.wktProjections = {
    "Lambert Tangential Conformal Conic Projection": "lcc",
    Mercator: "merc",
    "Popular Visualisation Pseudo Mercator": "merc",
    Mercator_1SP: "merc",
    Transverse_Mercator: "tmerc",
    "Transverse Mercator": "tmerc",
    "Lambert Azimuthal Equal Area": "laea",
    "Universal Transverse Mercator System": "utm"
},
Proj4js.Proj.aea = {
    init: function() {
        return Math.abs(this.lat1 + this.lat2) < Proj4js.common.EPSLN ? (Proj4js.reportError("aeaInitEqualLatitudes"),
        void 0) : (this.temp = this.b / this.a,
        this.es = 1 - Math.pow(this.temp, 2),
        this.e3 = Math.sqrt(this.es),
        this.sin_po = Math.sin(this.lat1),
        this.cos_po = Math.cos(this.lat1),
        this.t1 = this.sin_po,
        this.con = this.sin_po,
        this.ms1 = Proj4js.common.msfnz(this.e3, this.sin_po, this.cos_po),
        this.qs1 = Proj4js.common.qsfnz(this.e3, this.sin_po, this.cos_po),
        this.sin_po = Math.sin(this.lat2),
        this.cos_po = Math.cos(this.lat2),
        this.t2 = this.sin_po,
        this.ms2 = Proj4js.common.msfnz(this.e3, this.sin_po, this.cos_po),
        this.qs2 = Proj4js.common.qsfnz(this.e3, this.sin_po, this.cos_po),
        this.sin_po = Math.sin(this.lat0),
        this.cos_po = Math.cos(this.lat0),
        this.t3 = this.sin_po,
        this.qs0 = Proj4js.common.qsfnz(this.e3, this.sin_po, this.cos_po),
        this.ns0 = Math.abs(this.lat1 - this.lat2) > Proj4js.common.EPSLN ? (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1) : this.con,
        this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1,
        this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0,
        void 0)
    },
    forward: function(e) {
        var t = e.x
          , i = e.y;
        this.sin_phi = Math.sin(i),
        this.cos_phi = Math.cos(i);
        var n = Proj4js.common.qsfnz(this.e3, this.sin_phi, this.cos_phi)
          , r = this.a * Math.sqrt(this.c - this.ns0 * n) / this.ns0
          , s = this.ns0 * Proj4js.common.adjust_lon(t - this.long0)
          , o = r * Math.sin(s) + this.x0
          , a = this.rh - r * Math.cos(s) + this.y0;
        return e.x = o,
        e.y = a,
        e
    },
    inverse: function(e) {
        var t, i, n, r, s, o;
        return e.x -= this.x0,
        e.y = this.rh - e.y + this.y0,
        this.ns0 >= 0 ? (t = Math.sqrt(e.x * e.x + e.y * e.y),
        n = 1) : (t = -Math.sqrt(e.x * e.x + e.y * e.y),
        n = -1),
        r = 0,
        0 != t && (r = Math.atan2(n * e.x, n * e.y)),
        n = t * this.ns0 / this.a,
        i = (this.c - n * n) / this.ns0,
        this.e3 >= 1e-10 ? (n = 1 - .5 * (1 - this.es) * Math.log((1 - this.e3) / (1 + this.e3)) / this.e3,
        o = Math.abs(Math.abs(n) - Math.abs(i)) > 1e-10 ? this.phi1z(this.e3, i) : i >= 0 ? .5 * Proj4js.common.PI : -.5 * Proj4js.common.PI) : o = this.phi1z(this.e3, i),
        s = Proj4js.common.adjust_lon(r / this.ns0 + this.long0),
        e.x = s,
        e.y = o,
        e
    },
    phi1z: function(e, t) {
        var i, n, r, s, o, a = Proj4js.common.asinz(.5 * t);
        if (Proj4js.common.EPSLN > e)
            return a;
        for (var l = e * e, h = 1; 25 >= h; h++)
            if (i = Math.sin(a),
            n = Math.cos(a),
            r = e * i,
            s = 1 - r * r,
            o = .5 * s * s / n * (t / (1 - l) - i / s + .5 / e * Math.log((1 - r) / (1 + r))),
            a += o,
            1e-7 >= Math.abs(o))
                return a;
        return Proj4js.reportError("aea:phi1z:Convergence error"),
        null
    }
},
Proj4js.Proj.sterea = {
    dependsOn: "gauss",
    init: function() {
        return Proj4js.Proj.gauss.init.apply(this),
        this.rc ? (this.sinc0 = Math.sin(this.phic0),
        this.cosc0 = Math.cos(this.phic0),
        this.R2 = 2 * this.rc,
        this.title || (this.title = "Oblique Stereographic Alternative"),
        void 0) : (Proj4js.reportError("sterea:init:E_ERROR_0"),
        void 0)
    },
    forward: function(e) {
        var t, i, n, r;
        return e.x = Proj4js.common.adjust_lon(e.x - this.long0),
        Proj4js.Proj.gauss.forward.apply(this, [e]),
        t = Math.sin(e.y),
        i = Math.cos(e.y),
        n = Math.cos(e.x),
        r = this.k0 * this.R2 / (1 + this.sinc0 * t + this.cosc0 * i * n),
        e.x = r * i * Math.sin(e.x),
        e.y = r * (this.cosc0 * t - this.sinc0 * i * n),
        e.x = this.a * e.x + this.x0,
        e.y = this.a * e.y + this.y0,
        e
    },
    inverse: function(e) {
        var t, i, n, r, s;
        if (e.x = (e.x - this.x0) / this.a,
        e.y = (e.y - this.y0) / this.a,
        e.x /= this.k0,
        e.y /= this.k0,
        s = Math.sqrt(e.x * e.x + e.y * e.y)) {
            var o = 2 * Math.atan2(s, this.R2);
            t = Math.sin(o),
            i = Math.cos(o),
            r = Math.asin(i * this.sinc0 + e.y * t * this.cosc0 / s),
            n = Math.atan2(e.x * t, s * this.cosc0 * i - e.y * this.sinc0 * t)
        } else
            r = this.phic0,
            n = 0;
        return e.x = n,
        e.y = r,
        Proj4js.Proj.gauss.inverse.apply(this, [e]),
        e.x = Proj4js.common.adjust_lon(e.x + this.long0),
        e
    }
},
Proj4js.Proj.poly = {
    init: function() {
        0 == this.lat0 && (this.lat0 = 90),
        this.temp = this.b / this.a,
        this.es = 1 - Math.pow(this.temp, 2),
        this.e = Math.sqrt(this.es),
        this.e0 = Proj4js.common.e0fn(this.es),
        this.e1 = Proj4js.common.e1fn(this.es),
        this.e2 = Proj4js.common.e2fn(this.es),
        this.e3 = Proj4js.common.e3fn(this.es),
        this.ml0 = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0)
    },
    forward: function(e) {
        var t, i, n, r, s, o, a, l = e.x, h = e.y;
        return n = Proj4js.common.adjust_lon(l - this.long0),
        1e-7 >= Math.abs(h) ? (o = this.x0 + this.a * n,
        a = this.y0 - this.a * this.ml0) : (t = Math.sin(h),
        i = Math.cos(h),
        r = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, h),
        s = Proj4js.common.msfnz(this.e, t, i),
        n = t,
        o = this.x0 + this.a * s * Math.sin(n) / t,
        a = this.y0 + this.a * (r - this.ml0 + s * (1 - Math.cos(n)) / t)),
        e.x = o,
        e.y = a,
        e
    },
    inverse: function(e) {
        var t, i, n, r, s, o;
        if (e.x -= this.x0,
        e.y -= this.y0,
        t = this.ml0 + e.y / this.a,
        r = 0,
        1e-7 >= Math.abs(t))
            s = e.x / this.a + this.long0,
            o = 0;
        else {
            if (i = t * t + e.x / this.a * (e.x / this.a),
            r = phi4z(this.es, this.e0, this.e1, this.e2, this.e3, this.al, i, n, o),
            1 != r)
                return r;
            s = Proj4js.common.adjust_lon(Proj4js.common.asinz(e.x * n / this.a) / Math.sin(o) + this.long0)
        }
        return e.x = s,
        e.y = o,
        e
    }
},
Proj4js.Proj.equi = {
    init: function() {
        this.x0 || (this.x0 = 0),
        this.y0 || (this.y0 = 0),
        this.lat0 || (this.lat0 = 0),
        this.long0 || (this.long0 = 0)
    },
    forward: function(e) {
        var t = e.x
          , i = e.y
          , n = Proj4js.common.adjust_lon(t - this.long0)
          , r = this.x0 + this.a * n * Math.cos(this.lat0)
          , s = this.y0 + this.a * i;
        return this.t1 = r,
        this.t2 = Math.cos(this.lat0),
        e.x = r,
        e.y = s,
        e
    },
    inverse: function(e) {
        e.x -= this.x0,
        e.y -= this.y0;
        var t = e.y / this.a;
        Math.abs(t) > Proj4js.common.HALF_PI && Proj4js.reportError("equi:Inv:DataError");
        var i = Proj4js.common.adjust_lon(this.long0 + e.x / (this.a * Math.cos(this.lat0)));
        e.x = i,
        e.y = t
    }
},
Proj4js.Proj.merc = {
    init: function() {
        this.lat_ts && (this.k0 = this.sphere ? Math.cos(this.lat_ts) : Proj4js.common.msfnz(this.es, Math.sin(this.lat_ts), Math.cos(this.lat_ts)))
    },
    forward: function(e) {
        var t = e.x
          , i = e.y;
        if (i * Proj4js.common.R2D > 90 && -90 > i * Proj4js.common.R2D && t * Proj4js.common.R2D > 180 && -180 > t * Proj4js.common.R2D)
            return Proj4js.reportError("merc:forward: llInputOutOfRange: " + t + " : " + i),
            null;
        var n, r;
        if (Math.abs(Math.abs(i) - Proj4js.common.HALF_PI) <= Proj4js.common.EPSLN)
            return Proj4js.reportError("merc:forward: ll2mAtPoles"),
            null;
        if (this.sphere)
            n = this.x0 + this.a * this.k0 * Proj4js.common.adjust_lon(t - this.long0),
            r = this.y0 + this.a * this.k0 * Math.log(Math.tan(Proj4js.common.FORTPI + .5 * i));
        else {
            var s = Math.sin(i)
              , o = Proj4js.common.tsfnz(this.e, i, s);
            n = this.x0 + this.a * this.k0 * Proj4js.common.adjust_lon(t - this.long0),
            r = this.y0 - this.a * this.k0 * Math.log(o)
        }
        return e.x = n,
        e.y = r,
        e
    },
    inverse: function(e) {
        var t, i, n = e.x - this.x0, r = e.y - this.y0;
        if (this.sphere)
            i = Proj4js.common.HALF_PI - 2 * Math.atan(Math.exp(-r / this.a * this.k0));
        else {
            var s = Math.exp(-r / (this.a * this.k0));
            if (i = Proj4js.common.phi2z(this.e, s),
            -9999 == i)
                return Proj4js.reportError("merc:inverse: lat = -9999"),
                null
        }
        return t = Proj4js.common.adjust_lon(this.long0 + n / (this.a * this.k0)),
        e.x = t,
        e.y = i,
        e
    }
},
Proj4js.Proj.utm = {
    dependsOn: "tmerc",
    init: function() {
        return this.zone ? (this.lat0 = 0,
        this.long0 = (6 * Math.abs(this.zone) - 183) * Proj4js.common.D2R,
        this.x0 = 5e5,
        this.y0 = this.utmSouth ? 1e7 : 0,
        this.k0 = .9996,
        Proj4js.Proj.tmerc.init.apply(this),
        this.forward = Proj4js.Proj.tmerc.forward,
        this.inverse = Proj4js.Proj.tmerc.inverse,
        void 0) : (Proj4js.reportError("utm:init: zone must be specified for UTM"),
        void 0)
    }
},
Proj4js.Proj.eqdc = {
    init: function() {
        this.mode || (this.mode = 0),
        this.temp = this.b / this.a,
        this.es = 1 - Math.pow(this.temp, 2),
        this.e = Math.sqrt(this.es),
        this.e0 = Proj4js.common.e0fn(this.es),
        this.e1 = Proj4js.common.e1fn(this.es),
        this.e2 = Proj4js.common.e2fn(this.es),
        this.e3 = Proj4js.common.e3fn(this.es),
        this.sinphi = Math.sin(this.lat1),
        this.cosphi = Math.cos(this.lat1),
        this.ms1 = Proj4js.common.msfnz(this.e, this.sinphi, this.cosphi),
        this.ml1 = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat1),
        0 != this.mode ? (Math.abs(this.lat1 + this.lat2) < Proj4js.common.EPSLN && Proj4js.reportError("eqdc:Init:EqualLatitudes"),
        this.sinphi = Math.sin(this.lat2),
        this.cosphi = Math.cos(this.lat2),
        this.ms2 = Proj4js.common.msfnz(this.e, this.sinphi, this.cosphi),
        this.ml2 = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat2),
        this.ns = Math.abs(this.lat1 - this.lat2) >= Proj4js.common.EPSLN ? (this.ms1 - this.ms2) / (this.ml2 - this.ml1) : this.sinphi) : this.ns = this.sinphi,
        this.g = this.ml1 + this.ms1 / this.ns,
        this.ml0 = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0),
        this.rh = this.a * (this.g - this.ml0)
    },
    forward: function(e) {
        var t = e.x
          , i = e.y
          , n = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, i)
          , r = this.a * (this.g - n)
          , s = this.ns * Proj4js.common.adjust_lon(t - this.long0)
          , o = this.x0 + r * Math.sin(s)
          , a = this.y0 + this.rh - r * Math.cos(s);
        return e.x = o,
        e.y = a,
        e
    },
    inverse: function(e) {
        e.x -= this.x0,
        e.y = this.rh - e.y + this.y0;
        var t, i;
        this.ns >= 0 ? (i = Math.sqrt(e.x * e.x + e.y * e.y),
        t = 1) : (i = -Math.sqrt(e.x * e.x + e.y * e.y),
        t = -1);
        var n = 0;
        0 != i && (n = Math.atan2(t * e.x, t * e.y));
        var r = this.g - i / this.a
          , s = this.phi3z(r, this.e0, this.e1, this.e2, this.e3)
          , o = Proj4js.common.adjust_lon(this.long0 + n / this.ns);
        return e.x = o,
        e.y = s,
        e
    },
    phi3z: function(e, t, i, n, r) {
        var s, o;
        s = e;
        for (var a = 0; 15 > a; a++)
            if (o = (e + i * Math.sin(2 * s) - n * Math.sin(4 * s) + r * Math.sin(6 * s)) / t - s,
            s += o,
            1e-10 >= Math.abs(o))
                return s;
        return Proj4js.reportError("PHI3Z-CONV:Latitude failed to converge after 15 iterations"),
        null
    }
},
Proj4js.Proj.tmerc = {
    init: function() {
        this.e0 = Proj4js.common.e0fn(this.es),
        this.e1 = Proj4js.common.e1fn(this.es),
        this.e2 = Proj4js.common.e2fn(this.es),
        this.e3 = Proj4js.common.e3fn(this.es),
        this.ml0 = this.a * Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0)
    },
    forward: function(e) {
        var t, i, n, r = e.x, s = e.y, o = Proj4js.common.adjust_lon(r - this.long0), a = Math.sin(s), l = Math.cos(s);
        if (this.sphere) {
            var h = l * Math.sin(o);
            if (1e-10 > Math.abs(Math.abs(h) - 1))
                return Proj4js.reportError("tmerc:forward: Point projects into infinity"),
                93;
            i = .5 * this.a * this.k0 * Math.log((1 + h) / (1 - h)),
            t = Math.acos(l * Math.cos(o) / Math.sqrt(1 - h * h)),
            0 > s && (t = -t),
            n = this.a * this.k0 * (t - this.lat0)
        } else {
            var c = l * o
              , u = Math.pow(c, 2)
              , d = this.ep2 * Math.pow(l, 2)
              , p = Math.tan(s)
              , f = Math.pow(p, 2);
            t = 1 - this.es * Math.pow(a, 2);
            var m = this.a / Math.sqrt(t)
              , g = this.a * Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, s);
            i = this.k0 * m * c * (1 + u / 6 * (1 - f + d + u / 20 * (5 - 18 * f + Math.pow(f, 2) + 72 * d - 58 * this.ep2))) + this.x0,
            n = this.k0 * (g - this.ml0 + m * p * u * (.5 + u / 24 * (5 - f + 9 * d + 4 * Math.pow(d, 2) + u / 30 * (61 - 58 * f + Math.pow(f, 2) + 600 * d - 330 * this.ep2)))) + this.y0
        }
        return e.x = i,
        e.y = n,
        e
    },
    inverse: function(e) {
        var t, i, n, r, s, o, a = 6;
        if (this.sphere) {
            var l = Math.exp(e.x / (this.a * this.k0))
              , h = .5 * (l - 1 / l)
              , c = this.lat0 + e.y / (this.a * this.k0)
              , u = Math.cos(c);
            t = Math.sqrt((1 - u * u) / (1 + h * h)),
            s = Proj4js.common.asinz(t),
            0 > c && (s = -s),
            o = 0 == h && 0 == u ? this.long0 : Proj4js.common.adjust_lon(Math.atan2(h, u) + this.long0)
        } else {
            var d = e.x - this.x0
              , p = e.y - this.y0;
            for (t = (this.ml0 + p / this.k0) / this.a,
            i = t,
            r = 0; !0 && (n = (t + this.e1 * Math.sin(2 * i) - this.e2 * Math.sin(4 * i) + this.e3 * Math.sin(6 * i)) / this.e0 - i,
            i += n,
            !(Math.abs(n) <= Proj4js.common.EPSLN)); r++)
                if (r >= a)
                    return Proj4js.reportError("tmerc:inverse: Latitude failed to converge"),
                    95;
            if (Math.abs(i) < Proj4js.common.HALF_PI) {
                var f = Math.sin(i)
                  , m = Math.cos(i)
                  , g = Math.tan(i)
                  , y = this.ep2 * Math.pow(m, 2)
                  , v = Math.pow(y, 2)
                  , b = Math.pow(g, 2)
                  , L = Math.pow(b, 2);
                t = 1 - this.es * Math.pow(f, 2);
                var x = this.a / Math.sqrt(t)
                  , C = x * (1 - this.es) / t
                  , w = d / (x * this.k0)
                  , S = Math.pow(w, 2);
                s = i - x * g * S / C * (.5 - S / 24 * (5 + 3 * b + 10 * y - 4 * v - 9 * this.ep2 - S / 30 * (61 + 90 * b + 298 * y + 45 * L - 252 * this.ep2 - 3 * v))),
                o = Proj4js.common.adjust_lon(this.long0 + w * (1 - S / 6 * (1 + 2 * b + y - S / 20 * (5 - 2 * y + 28 * b - 3 * v + 8 * this.ep2 + 24 * L))) / m)
            } else
                s = Proj4js.common.HALF_PI * Proj4js.common.sign(p),
                o = this.long0
        }
        return e.x = o,
        e.y = s,
        e
    }
},
Proj4js.defs.GOOGLE = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs",
Proj4js.defs["EPSG:900913"] = Proj4js.defs.GOOGLE,
Proj4js.Proj.gstmerc = {
    init: function() {
        var e = this.b / this.a;
        this.e = Math.sqrt(1 - e * e),
        this.lc = this.long0,
        this.rs = Math.sqrt(1 + this.e * this.e * Math.pow(Math.cos(this.lat0), 4) / (1 - this.e * this.e));
        var t = Math.sin(this.lat0)
          , i = Math.asin(t / this.rs)
          , n = Math.sin(i);
        this.cp = Proj4js.common.latiso(0, i, n) - this.rs * Proj4js.common.latiso(this.e, this.lat0, t),
        this.n2 = this.k0 * this.a * Math.sqrt(1 - this.e * this.e) / (1 - this.e * this.e * t * t),
        this.xs = this.x0,
        this.ys = this.y0 - this.n2 * i,
        this.title || (this.title = "Gauss Schreiber transverse mercator")
    },
    forward: function(e) {
        var t = e.x
          , i = e.y
          , n = this.rs * (t - this.lc)
          , r = this.cp + this.rs * Proj4js.common.latiso(this.e, i, Math.sin(i))
          , s = Math.asin(Math.sin(n) / Proj4js.common.cosh(r))
          , o = Proj4js.common.latiso(0, s, Math.sin(s));
        return e.x = this.xs + this.n2 * o,
        e.y = this.ys + this.n2 * Math.atan(Proj4js.common.sinh(r) / Math.cos(n)),
        e
    },
    inverse: function(e) {
        var t = e.x
          , i = e.y
          , n = Math.atan(Proj4js.common.sinh((t - this.xs) / this.n2) / Math.cos((i - this.ys) / this.n2))
          , r = Math.asin(Math.sin((i - this.ys) / this.n2) / Proj4js.common.cosh((t - this.xs) / this.n2))
          , s = Proj4js.common.latiso(0, r, Math.sin(r));
        return e.x = this.lc + n / this.rs,
        e.y = Proj4js.common.invlatiso(this.e, (s - this.cp) / this.rs),
        e
    }
},
Proj4js.Proj.ortho = {
    init: function() {
        this.sin_p14 = Math.sin(this.lat0),
        this.cos_p14 = Math.cos(this.lat0)
    },
    forward: function(e) {
        var t, i, n, r, s, o, a = e.x, l = e.y;
        if (n = Proj4js.common.adjust_lon(a - this.long0),
        t = Math.sin(l),
        i = Math.cos(l),
        r = Math.cos(n),
        o = this.sin_p14 * t + this.cos_p14 * i * r,
        s = 1,
        o > 0 || Math.abs(o) <= Proj4js.common.EPSLN)
            var h = this.a * s * i * Math.sin(n)
              , c = this.y0 + this.a * s * (this.cos_p14 * t - this.sin_p14 * i * r);
        else
            Proj4js.reportError("orthoFwdPointError");
        return e.x = h,
        e.y = c,
        e
    },
    inverse: function(e) {
        var t, i, n, r, s, o, a;
        return e.x -= this.x0,
        e.y -= this.y0,
        t = Math.sqrt(e.x * e.x + e.y * e.y),
        t > this.a + 1e-7 && Proj4js.reportError("orthoInvDataError"),
        i = Proj4js.common.asinz(t / this.a),
        n = Math.sin(i),
        r = Math.cos(i),
        o = this.long0,
        Math.abs(t) <= Proj4js.common.EPSLN && (a = this.lat0),
        a = Proj4js.common.asinz(r * this.sin_p14 + e.y * n * this.cos_p14 / t),
        s = Math.abs(this.lat0) - Proj4js.common.HALF_PI,
        Math.abs(s) <= Proj4js.common.EPSLN && (o = this.lat0 >= 0 ? Proj4js.common.adjust_lon(this.long0 + Math.atan2(e.x, -e.y)) : Proj4js.common.adjust_lon(this.long0 - Math.atan2(-e.x, e.y))),
        s = r - this.sin_p14 * Math.sin(a),
        e.x = o,
        e.y = a,
        e
    }
},
Proj4js.Proj.krovak = {
    init: function() {
        this.a = 6377397.155,
        this.es = .006674372230614,
        this.e = Math.sqrt(this.es),
        this.lat0 || (this.lat0 = .863937979737193),
        this.long0 || (this.long0 = .4334234309119251),
        this.k0 || (this.k0 = .9999),
        this.s45 = .785398163397448,
        this.s90 = 2 * this.s45,
        this.fi0 = this.lat0,
        this.e2 = this.es,
        this.e = Math.sqrt(this.e2),
        this.alfa = Math.sqrt(1 + this.e2 * Math.pow(Math.cos(this.fi0), 4) / (1 - this.e2)),
        this.uq = 1.04216856380474,
        this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa),
        this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2),
        this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g,
        this.k1 = this.k0,
        this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2)),
        this.s0 = 1.37008346281555,
        this.n = Math.sin(this.s0),
        this.ro0 = this.k1 * this.n0 / Math.tan(this.s0),
        this.ad = this.s90 - this.uq
    },
    forward: function(e) {
        var t, i, n, r, s, o, a, l = e.x, h = e.y, c = Proj4js.common.adjust_lon(l - this.long0);
        return t = Math.pow((1 + this.e * Math.sin(h)) / (1 - this.e * Math.sin(h)), this.alfa * this.e / 2),
        i = 2 * (Math.atan(this.k * Math.pow(Math.tan(h / 2 + this.s45), this.alfa) / t) - this.s45),
        n = -c * this.alfa,
        r = Math.asin(Math.cos(this.ad) * Math.sin(i) + Math.sin(this.ad) * Math.cos(i) * Math.cos(n)),
        s = Math.asin(Math.cos(i) * Math.sin(n) / Math.cos(r)),
        o = this.n * s,
        a = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(r / 2 + this.s45), this.n),
        e.y = a * Math.cos(o) / 1,
        e.x = a * Math.sin(o) / 1,
        this.czech && (e.y *= -1,
        e.x *= -1),
        e
    },
    inverse: function(e) {
        var t, i, n, r, s, o, a, l, h = e.x;
        e.x = e.y,
        e.y = h,
        this.czech && (e.y *= -1,
        e.x *= -1),
        o = Math.sqrt(e.x * e.x + e.y * e.y),
        s = Math.atan2(e.y, e.x),
        r = s / Math.sin(this.s0),
        n = 2 * (Math.atan(Math.pow(this.ro0 / o, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45),
        t = Math.asin(Math.cos(this.ad) * Math.sin(n) - Math.sin(this.ad) * Math.cos(n) * Math.cos(r)),
        i = Math.asin(Math.cos(n) * Math.sin(r) / Math.cos(t)),
        e.x = this.long0 - i / this.alfa,
        a = t,
        l = 0;
        var c = 0;
        do
            e.y = 2 * (Math.atan(Math.pow(this.k, -1 / this.alfa) * Math.pow(Math.tan(t / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(a)) / (1 - this.e * Math.sin(a)), this.e / 2)) - this.s45),
            1e-10 > Math.abs(a - e.y) && (l = 1),
            a = e.y,
            c += 1;
        while (0 == l && 15 > c);return c >= 15 ? (Proj4js.reportError("PHI3Z-CONV:Latitude failed to converge after 15 iterations"),
        null) : e
    }
},
Proj4js.Proj.somerc = {
    init: function() {
        var e = this.lat0;
        this.lambda0 = this.long0;
        var t = Math.sin(e)
          , i = this.a
          , n = this.rf
          , r = 1 / n
          , s = 2 * r - Math.pow(r, 2)
          , o = this.e = Math.sqrt(s);
        this.R = this.k0 * i * Math.sqrt(1 - s) / (1 - s * Math.pow(t, 2)),
        this.alpha = Math.sqrt(1 + s / (1 - s) * Math.pow(Math.cos(e), 4)),
        this.b0 = Math.asin(t / this.alpha),
        this.K = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2)) - this.alpha * Math.log(Math.tan(Math.PI / 4 + e / 2)) + this.alpha * o / 2 * Math.log((1 + o * t) / (1 - o * t))
    },
    forward: function(e) {
        var t = Math.log(Math.tan(Math.PI / 4 - e.y / 2))
          , i = this.e / 2 * Math.log((1 + this.e * Math.sin(e.y)) / (1 - this.e * Math.sin(e.y)))
          , n = -this.alpha * (t + i) + this.K
          , r = 2 * (Math.atan(Math.exp(n)) - Math.PI / 4)
          , s = this.alpha * (e.x - this.lambda0)
          , o = Math.atan(Math.sin(s) / (Math.sin(this.b0) * Math.tan(r) + Math.cos(this.b0) * Math.cos(s)))
          , a = Math.asin(Math.cos(this.b0) * Math.sin(r) - Math.sin(this.b0) * Math.cos(r) * Math.cos(s));
        return e.y = this.R / 2 * Math.log((1 + Math.sin(a)) / (1 - Math.sin(a))) + this.y0,
        e.x = this.R * o + this.x0,
        e
    },
    inverse: function(e) {
        for (var t = e.x - this.x0, i = e.y - this.y0, n = t / this.R, r = 2 * (Math.atan(Math.exp(i / this.R)) - Math.PI / 4), s = Math.asin(Math.cos(this.b0) * Math.sin(r) + Math.sin(this.b0) * Math.cos(r) * Math.cos(n)), o = Math.atan(Math.sin(n) / (Math.cos(this.b0) * Math.cos(n) - Math.sin(this.b0) * Math.tan(r))), a = this.lambda0 + o / this.alpha, l = 0, h = s, c = -1e3, u = 0; Math.abs(h - c) > 1e-7; ) {
            if (++u > 20)
                return Proj4js.reportError("omercFwdInfinity"),
                void 0;
            l = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + s / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(h)) / 2)),
            c = h,
            h = 2 * Math.atan(Math.exp(l)) - Math.PI / 2
        }
        return e.x = a,
        e.y = h,
        e
    }
},
Proj4js.Proj.stere = {
    ssfn_: function(e, t, i) {
        return t *= i,
        Math.tan(.5 * (Proj4js.common.HALF_PI + e)) * Math.pow((1 - t) / (1 + t), .5 * i)
    },
    TOL: 1e-8,
    NITER: 8,
    CONV: 1e-10,
    S_POLE: 0,
    N_POLE: 1,
    OBLIQ: 2,
    EQUIT: 3,
    init: function() {
        this.phits = this.lat_ts ? this.lat_ts : Proj4js.common.HALF_PI;
        var e = Math.abs(this.lat0);
        if (this.mode = Math.abs(e) - Proj4js.common.HALF_PI < Proj4js.common.EPSLN ? 0 > this.lat0 ? this.S_POLE : this.N_POLE : e > Proj4js.common.EPSLN ? this.OBLIQ : this.EQUIT,
        this.phits = Math.abs(this.phits),
        this.es) {
            var t;
            switch (this.mode) {
            case this.N_POLE:
            case this.S_POLE:
                Math.abs(this.phits - Proj4js.common.HALF_PI) < Proj4js.common.EPSLN ? this.akm1 = 2 * this.k0 / Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e)) : (e = Math.sin(this.phits),
                this.akm1 = Math.cos(this.phits) / Proj4js.common.tsfnz(this.e, this.phits, e),
                e *= this.e,
                this.akm1 /= Math.sqrt(1 - e * e));
                break;
            case this.EQUIT:
                this.akm1 = 2 * this.k0;
                break;
            case this.OBLIQ:
                e = Math.sin(this.lat0),
                t = 2 * Math.atan(this.ssfn_(this.lat0, e, this.e)) - Proj4js.common.HALF_PI,
                e *= this.e,
                this.akm1 = 2 * this.k0 * Math.cos(this.lat0) / Math.sqrt(1 - e * e),
                this.sinX1 = Math.sin(t),
                this.cosX1 = Math.cos(t)
            }
        } else
            switch (this.mode) {
            case this.OBLIQ:
                this.sinph0 = Math.sin(this.lat0),
                this.cosph0 = Math.cos(this.lat0);
            case this.EQUIT:
                this.akm1 = 2 * this.k0;
                break;
            case this.S_POLE:
            case this.N_POLE:
                this.akm1 = Math.abs(this.phits - Proj4js.common.HALF_PI) >= Proj4js.common.EPSLN ? Math.cos(this.phits) / Math.tan(Proj4js.common.FORTPI - .5 * this.phits) : 2 * this.k0
            }
    },
    forward: function(e) {
        var t = e.x;
        t = Proj4js.common.adjust_lon(t - this.long0);
        var i, n, r = e.y;
        if (this.sphere) {
            var s, o, a, l;
            switch (s = Math.sin(r),
            o = Math.cos(r),
            a = Math.cos(t),
            l = Math.sin(t),
            this.mode) {
            case this.EQUIT:
                n = 1 + o * a,
                Proj4js.common.EPSLN >= n && Proj4js.reportError("stere:forward:Equit"),
                n = this.akm1 / n,
                i = n * o * l,
                n *= s;
                break;
            case this.OBLIQ:
                n = 1 + this.sinph0 * s + this.cosph0 * o * a,
                Proj4js.common.EPSLN >= n && Proj4js.reportError("stere:forward:Obliq"),
                n = this.akm1 / n,
                i = n * o * l,
                n *= this.cosph0 * s - this.sinph0 * o * a;
                break;
            case this.N_POLE:
                a = -a,
                r = -r;
            case this.S_POLE:
                Math.abs(r - Proj4js.common.HALF_PI) < this.TOL && Proj4js.reportError("stere:forward:S_POLE"),
                n = this.akm1 * Math.tan(Proj4js.common.FORTPI + .5 * r),
                i = l * n,
                n *= a
            }
        } else {
            a = Math.cos(t),
            l = Math.sin(t),
            s = Math.sin(r);
            var h, c;
            if (this.mode == this.OBLIQ || this.mode == this.EQUIT) {
                var u = 2 * Math.atan(this.ssfn_(r, s, this.e));
                h = Math.sin(u - Proj4js.common.HALF_PI),
                c = Math.cos(u)
            }
            switch (this.mode) {
            case this.OBLIQ:
                var d = this.akm1 / (this.cosX1 * (1 + this.sinX1 * h + this.cosX1 * c * a));
                n = d * (this.cosX1 * h - this.sinX1 * c * a),
                i = d * c;
                break;
            case this.EQUIT:
                var d = 2 * this.akm1 / (1 + c * a);
                n = d * h,
                i = d * c;
                break;
            case this.S_POLE:
                r = -r,
                a = -a,
                s = -s;
            case this.N_POLE:
                i = this.akm1 * Proj4js.common.tsfnz(this.e, r, s),
                n = -i * a
            }
            i *= l
        }
        return e.x = i * this.a + this.x0,
        e.y = n * this.a + this.y0,
        e
    },
    inverse: function(e) {
        var t, i, n, r, s, o, a = (e.x - this.x0) / this.a, l = (e.y - this.y0) / this.a, h = 0, c = 0, u = 0, d = 0;
        if (this.sphere) {
            var p, f, m, g;
            switch (f = Math.sqrt(a * a + l * l),
            p = 2 * Math.atan(f / this.akm1),
            m = Math.sin(p),
            g = Math.cos(p),
            t = 0,
            this.mode) {
            case this.EQUIT:
                i = Math.abs(f) <= Proj4js.common.EPSLN ? 0 : Math.asin(l * m / f),
                (0 != g || 0 != a) && (t = Math.atan2(a * m, g * f));
                break;
            case this.OBLIQ:
                i = Math.abs(f) <= Proj4js.common.EPSLN ? this.phi0 : Math.asin(g * this.sinph0 + l * m * this.cosph0 / f),
                p = g - this.sinph0 * Math.sin(i),
                (0 != p || 0 != a) && (t = Math.atan2(a * m * this.cosph0, p * f));
                break;
            case this.N_POLE:
                l = -l;
            case this.S_POLE:
                i = Math.abs(f) <= Proj4js.common.EPSLN ? this.phi0 : Math.asin(this.mode == this.S_POLE ? -g : g),
                t = 0 == a && 0 == l ? 0 : Math.atan2(a, l)
            }
            e.x = Proj4js.common.adjust_lon(t + this.long0),
            e.y = i
        } else {
            switch (s = Math.sqrt(a * a + l * l),
            this.mode) {
            case this.OBLIQ:
            case this.EQUIT:
                h = 2 * Math.atan2(s * this.cosX1, this.akm1),
                n = Math.cos(h),
                r = Math.sin(h),
                c = 0 == s ? Math.asin(n * this.sinX1) : Math.asin(n * this.sinX1 + l * r * this.cosX1 / s),
                h = Math.tan(.5 * (Proj4js.common.HALF_PI + c)),
                a *= r,
                l = s * this.cosX1 * n - l * this.sinX1 * r,
                d = Proj4js.common.HALF_PI,
                u = .5 * this.e;
                break;
            case this.N_POLE:
                l = -l;
            case this.S_POLE:
                h = -s / this.akm1,
                c = Proj4js.common.HALF_PI - 2 * Math.atan(h),
                d = -Proj4js.common.HALF_PI,
                u = -.5 * this.e
            }
            for (o = this.NITER; o--; c = i)
                if (r = this.e * Math.sin(c),
                i = 2 * Math.atan(h * Math.pow((1 + r) / (1 - r), u)) - d,
                Math.abs(c - i) < this.CONV)
                    return this.mode == this.S_POLE && (i = -i),
                    t = 0 == a && 0 == l ? 0 : Math.atan2(a, l),
                    e.x = Proj4js.common.adjust_lon(t + this.long0),
                    e.y = i,
                    e
        }
    }
},
Proj4js.Proj.nzmg = {
    iterations: 1,
    init: function() {
        this.A = [],
        this.A[1] = .6399175073,
        this.A[2] = -.1358797613,
        this.A[3] = .063294409,
        this.A[4] = -.02526853,
        this.A[5] = .0117879,
        this.A[6] = -.0055161,
        this.A[7] = .0026906,
        this.A[8] = -.001333,
        this.A[9] = 67e-5,
        this.A[10] = -34e-5,
        this.B_re = [],
        this.B_im = [],
        this.B_re[1] = .7557853228,
        this.B_im[1] = 0,
        this.B_re[2] = .249204646,
        this.B_im[2] = .003371507,
        this.B_re[3] = -.001541739,
        this.B_im[3] = .04105856,
        this.B_re[4] = -.10162907,
        this.B_im[4] = .01727609,
        this.B_re[5] = -.26623489,
        this.B_im[5] = -.36249218,
        this.B_re[6] = -.6870983,
        this.B_im[6] = -1.1651967,
        this.C_re = [],
        this.C_im = [],
        this.C_re[1] = 1.3231270439,
        this.C_im[1] = 0,
        this.C_re[2] = -.577245789,
        this.C_im[2] = -.007809598,
        this.C_re[3] = .508307513,
        this.C_im[3] = -.112208952,
        this.C_re[4] = -.15094762,
        this.C_im[4] = .18200602,
        this.C_re[5] = 1.01418179,
        this.C_im[5] = 1.64497696,
        this.C_re[6] = 1.9660549,
        this.C_im[6] = 2.5127645,
        this.D = [],
        this.D[1] = 1.5627014243,
        this.D[2] = .5185406398,
        this.D[3] = -.03333098,
        this.D[4] = -.1052906,
        this.D[5] = -.0368594,
        this.D[6] = .007317,
        this.D[7] = .0122,
        this.D[8] = .00394,
        this.D[9] = -.0013
    },
    forward: function(e) {
        for (var t = e.x, i = e.y, n = i - this.lat0, r = t - this.long0, s = 1e-5 * (n / Proj4js.common.SEC_TO_RAD), o = r, a = 1, l = 0, h = 1; 10 >= h; h++)
            a *= s,
            l += this.A[h] * a;
        for (var c, u, d = l, p = o, f = 1, m = 0, g = 0, y = 0, h = 1; 6 >= h; h++)
            c = f * d - m * p,
            u = m * d + f * p,
            f = c,
            m = u,
            g = g + this.B_re[h] * f - this.B_im[h] * m,
            y = y + this.B_im[h] * f + this.B_re[h] * m;
        return e.x = y * this.a + this.x0,
        e.y = g * this.a + this.y0,
        e
    },
    inverse: function(e) {
        for (var t, i, n = e.x, r = e.y, s = n - this.x0, o = r - this.y0, a = o / this.a, l = s / this.a, h = 1, c = 0, u = 0, d = 0, p = 1; 6 >= p; p++)
            t = h * a - c * l,
            i = c * a + h * l,
            h = t,
            c = i,
            u = u + this.C_re[p] * h - this.C_im[p] * c,
            d = d + this.C_im[p] * h + this.C_re[p] * c;
        for (var f = 0; this.iterations > f; f++) {
            for (var m, g, y = u, v = d, b = a, L = l, p = 2; 6 >= p; p++)
                m = y * u - v * d,
                g = v * u + y * d,
                y = m,
                v = g,
                b += (p - 1) * (this.B_re[p] * y - this.B_im[p] * v),
                L += (p - 1) * (this.B_im[p] * y + this.B_re[p] * v);
            y = 1,
            v = 0;
            for (var x = this.B_re[1], C = this.B_im[1], p = 2; 6 >= p; p++)
                m = y * u - v * d,
                g = v * u + y * d,
                y = m,
                v = g,
                x += p * (this.B_re[p] * y - this.B_im[p] * v),
                C += p * (this.B_im[p] * y + this.B_re[p] * v);
            var w = x * x + C * C;
            u = (b * x + L * C) / w,
            d = (L * x - b * C) / w
        }
        for (var S = u, O = d, _ = 1, E = 0, p = 1; 9 >= p; p++)
            _ *= S,
            E += this.D[p] * _;
        var k = this.lat0 + 1e5 * E * Proj4js.common.SEC_TO_RAD
          , T = this.long0 + O;
        return e.x = T,
        e.y = k,
        e
    }
},
Proj4js.Proj.mill = {
    init: function() {},
    forward: function(e) {
        var t = e.x
          , i = e.y
          , n = Proj4js.common.adjust_lon(t - this.long0)
          , r = this.x0 + this.a * n
          , s = this.y0 + 1.25 * this.a * Math.log(Math.tan(Proj4js.common.PI / 4 + i / 2.5));
        return e.x = r,
        e.y = s,
        e
    },
    inverse: function(e) {
        e.x -= this.x0,
        e.y -= this.y0;
        var t = Proj4js.common.adjust_lon(this.long0 + e.x / this.a)
          , i = 2.5 * (Math.atan(Math.exp(.8 * e.y / this.a)) - Proj4js.common.PI / 4);
        return e.x = t,
        e.y = i,
        e
    }
},
Proj4js.Proj.gnom = {
    init: function() {
        this.sin_p14 = Math.sin(this.lat0),
        this.cos_p14 = Math.cos(this.lat0),
        this.infinity_dist = 1e3 * this.a,
        this.rc = 1
    },
    forward: function(e) {
        var t, i, n, r, s, o, a, l, h = e.x, c = e.y;
        return n = Proj4js.common.adjust_lon(h - this.long0),
        t = Math.sin(c),
        i = Math.cos(c),
        r = Math.cos(n),
        o = this.sin_p14 * t + this.cos_p14 * i * r,
        s = 1,
        o > 0 || Math.abs(o) <= Proj4js.common.EPSLN ? (a = this.x0 + this.a * s * i * Math.sin(n) / o,
        l = this.y0 + this.a * s * (this.cos_p14 * t - this.sin_p14 * i * r) / o) : (Proj4js.reportError("orthoFwdPointError"),
        a = this.x0 + this.infinity_dist * i * Math.sin(n),
        l = this.y0 + this.infinity_dist * (this.cos_p14 * t - this.sin_p14 * i * r)),
        e.x = a,
        e.y = l,
        e
    },
    inverse: function(e) {
        var t, i, n, r, s, o;
        return e.x = (e.x - this.x0) / this.a,
        e.y = (e.y - this.y0) / this.a,
        e.x /= this.k0,
        e.y /= this.k0,
        (t = Math.sqrt(e.x * e.x + e.y * e.y)) ? (r = Math.atan2(t, this.rc),
        i = Math.sin(r),
        n = Math.cos(r),
        o = Proj4js.common.asinz(n * this.sin_p14 + e.y * i * this.cos_p14 / t),
        s = Math.atan2(e.x * i, t * this.cos_p14 * n - e.y * this.sin_p14 * i),
        s = Proj4js.common.adjust_lon(this.long0 + s)) : (o = this.phic0,
        s = 0),
        e.x = s,
        e.y = o,
        e
    }
},
Proj4js.Proj.sinu = {
    init: function() {
        this.sphere ? (this.n = 1,
        this.m = 0,
        this.es = 0,
        this.C_y = Math.sqrt((this.m + 1) / this.n),
        this.C_x = this.C_y / (this.m + 1)) : this.en = Proj4js.common.pj_enfn(this.es)
    },
    forward: function(e) {
        var t, i, n = e.x, r = e.y;
        if (n = Proj4js.common.adjust_lon(n - this.long0),
        this.sphere) {
            if (this.m)
                for (var s = this.n * Math.sin(r), o = Proj4js.common.MAX_ITER; o; --o) {
                    var a = (this.m * r + Math.sin(r) - s) / (this.m + Math.cos(r));
                    if (r -= a,
                    Math.abs(a) < Proj4js.common.EPSLN)
                        break
                }
            else
                r = 1 != this.n ? Math.asin(this.n * Math.sin(r)) : r;
            t = this.a * this.C_x * n * (this.m + Math.cos(r)),
            i = this.a * this.C_y * r
        } else {
            var l = Math.sin(r)
              , h = Math.cos(r);
            i = this.a * Proj4js.common.pj_mlfn(r, l, h, this.en),
            t = this.a * n * h / Math.sqrt(1 - this.es * l * l)
        }
        return e.x = t,
        e.y = i,
        e
    },
    inverse: function(e) {
        var t, i, n;
        if (e.x -= this.x0,
        e.y -= this.y0,
        t = e.y / this.a,
        this.sphere)
            e.y /= this.C_y,
            t = this.m ? Math.asin((this.m * e.y + Math.sin(e.y)) / this.n) : 1 != this.n ? Math.asin(Math.sin(e.y) / this.n) : e.y,
            n = e.x / (this.C_x * (this.m + Math.cos(e.y)));
        else {
            t = Proj4js.common.pj_inv_mlfn(e.y / this.a, this.es, this.en);
            var r = Math.abs(t);
            Proj4js.common.HALF_PI > r ? (r = Math.sin(t),
            i = this.long0 + e.x * Math.sqrt(1 - this.es * r * r) / (this.a * Math.cos(t)),
            n = Proj4js.common.adjust_lon(i)) : r - Proj4js.common.EPSLN < Proj4js.common.HALF_PI && (n = this.long0)
        }
        return e.x = n,
        e.y = t,
        e
    }
},
Proj4js.Proj.vandg = {
    init: function() {
        this.R = 6370997
    },
    forward: function(e) {
        var t, i, n = e.x, r = e.y, s = Proj4js.common.adjust_lon(n - this.long0);
        Math.abs(r) <= Proj4js.common.EPSLN && (t = this.x0 + this.R * s,
        i = this.y0);
        var o = Proj4js.common.asinz(2 * Math.abs(r / Proj4js.common.PI));
        (Math.abs(s) <= Proj4js.common.EPSLN || Math.abs(Math.abs(r) - Proj4js.common.HALF_PI) <= Proj4js.common.EPSLN) && (t = this.x0,
        i = r >= 0 ? this.y0 + Proj4js.common.PI * this.R * Math.tan(.5 * o) : this.y0 + Proj4js.common.PI * this.R * -Math.tan(.5 * o));
        var a = .5 * Math.abs(Proj4js.common.PI / s - s / Proj4js.common.PI)
          , l = a * a
          , h = Math.sin(o)
          , c = Math.cos(o)
          , u = c / (h + c - 1)
          , d = u * u
          , p = u * (2 / h - 1)
          , f = p * p
          , m = Proj4js.common.PI * this.R * (a * (u - f) + Math.sqrt(l * (u - f) * (u - f) - (f + l) * (d - f))) / (f + l);
        return 0 > s && (m = -m),
        t = this.x0 + m,
        m = Math.abs(m / (Proj4js.common.PI * this.R)),
        i = r >= 0 ? this.y0 + Proj4js.common.PI * this.R * Math.sqrt(1 - m * m - 2 * a * m) : this.y0 - Proj4js.common.PI * this.R * Math.sqrt(1 - m * m - 2 * a * m),
        e.x = t,
        e.y = i,
        e
    },
    inverse: function(e) {
        var t, i, n, r, s, o, a, l, h, c, u, d, p;
        return e.x -= this.x0,
        e.y -= this.y0,
        u = Proj4js.common.PI * this.R,
        n = e.x / u,
        r = e.y / u,
        s = n * n + r * r,
        o = -Math.abs(r) * (1 + s),
        a = o - 2 * r * r + n * n,
        l = -2 * o + 1 + 2 * r * r + s * s,
        p = r * r / l + (2 * a * a * a / l / l / l - 9 * o * a / l / l) / 27,
        h = (o - a * a / 3 / l) / l,
        c = 2 * Math.sqrt(-h / 3),
        u = 3 * p / h / c,
        Math.abs(u) > 1 && (u = u >= 0 ? 1 : -1),
        d = Math.acos(u) / 3,
        i = e.y >= 0 ? (-c * Math.cos(d + Proj4js.common.PI / 3) - a / 3 / l) * Proj4js.common.PI : -(-c * Math.cos(d + Proj4js.common.PI / 3) - a / 3 / l) * Proj4js.common.PI,
        Math.abs(n) < Proj4js.common.EPSLN && (t = this.long0),
        t = Proj4js.common.adjust_lon(this.long0 + Proj4js.common.PI * (s - 1 + Math.sqrt(1 + 2 * (n * n - r * r) + s * s)) / 2 / n),
        e.x = t,
        e.y = i,
        e
    }
},
Proj4js.Proj.cea = {
    init: function() {},
    forward: function(e) {
        var t = e.x
          , i = e.y
          , n = Proj4js.common.adjust_lon(t - this.long0)
          , r = this.x0 + this.a * n * Math.cos(this.lat_ts)
          , s = this.y0 + this.a * Math.sin(i) / Math.cos(this.lat_ts);
        return e.x = r,
        e.y = s,
        e
    },
    inverse: function(e) {
        e.x -= this.x0,
        e.y -= this.y0;
        var t = Proj4js.common.adjust_lon(this.long0 + e.x / this.a / Math.cos(this.lat_ts))
          , i = Math.asin(e.y / this.a * Math.cos(this.lat_ts));
        return e.x = t,
        e.y = i,
        e
    }
},
Proj4js.Proj.eqc = {
    init: function() {
        this.x0 || (this.x0 = 0),
        this.y0 || (this.y0 = 0),
        this.lat0 || (this.lat0 = 0),
        this.long0 || (this.long0 = 0),
        this.lat_ts || (this.lat_ts = 0),
        this.title || (this.title = "Equidistant Cylindrical (Plate Carre)"),
        this.rc = Math.cos(this.lat_ts)
    },
    forward: function(e) {
        var t = e.x
          , i = e.y
          , n = Proj4js.common.adjust_lon(t - this.long0)
          , r = Proj4js.common.adjust_lat(i - this.lat0);
        return e.x = this.x0 + this.a * n * this.rc,
        e.y = this.y0 + this.a * r,
        e
    },
    inverse: function(e) {
        var t = e.x
          , i = e.y;
        return e.x = Proj4js.common.adjust_lon(this.long0 + (t - this.x0) / (this.a * this.rc)),
        e.y = Proj4js.common.adjust_lat(this.lat0 + (i - this.y0) / this.a),
        e
    }
},
Proj4js.Proj.cass = {
    init: function() {
        this.sphere || (this.en = Proj4js.common.pj_enfn(this.es),
        this.m0 = Proj4js.common.pj_mlfn(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en))
    },
    C1: .16666666666666666,
    C2: .008333333333333333,
    C3: .041666666666666664,
    C4: .3333333333333333,
    C5: .06666666666666667,
    forward: function(e) {
        var t, i, n = e.x, r = e.y;
        return n = Proj4js.common.adjust_lon(n - this.long0),
        this.sphere ? (t = Math.asin(Math.cos(r) * Math.sin(n)),
        i = Math.atan2(Math.tan(r), Math.cos(n)) - this.phi0) : (this.n = Math.sin(r),
        this.c = Math.cos(r),
        i = Proj4js.common.pj_mlfn(r, this.n, this.c, this.en),
        this.n = 1 / Math.sqrt(1 - this.es * this.n * this.n),
        this.tn = Math.tan(r),
        this.t = this.tn * this.tn,
        this.a1 = n * this.c,
        this.c *= this.es * this.c / (1 - this.es),
        this.a2 = this.a1 * this.a1,
        t = this.n * this.a1 * (1 - this.a2 * this.t * (this.C1 - (8 - this.t + 8 * this.c) * this.a2 * this.C2)),
        i -= this.m0 - this.n * this.tn * this.a2 * (.5 + (5 - this.t + 6 * this.c) * this.a2 * this.C3)),
        e.x = this.a * t + this.x0,
        e.y = this.a * i + this.y0,
        e
    },
    inverse: function(e) {
        e.x -= this.x0,
        e.y -= this.y0;
        var t, i, n = e.x / this.a, r = e.y / this.a;
        if (this.sphere)
            this.dd = r + this.lat0,
            t = Math.asin(Math.sin(this.dd) * Math.cos(n)),
            i = Math.atan2(Math.tan(n), Math.cos(this.dd));
        else {
            var s = Proj4js.common.pj_inv_mlfn(this.m0 + r, this.es, this.en);
            this.tn = Math.tan(s),
            this.t = this.tn * this.tn,
            this.n = Math.sin(s),
            this.r = 1 / (1 - this.es * this.n * this.n),
            this.n = Math.sqrt(this.r),
            this.r *= (1 - this.es) * this.n,
            this.dd = n / this.n,
            this.d2 = this.dd * this.dd,
            t = s - this.n * this.tn / this.r * this.d2 * (.5 - (1 + 3 * this.t) * this.d2 * this.C3),
            i = this.dd * (1 + this.t * this.d2 * (-this.C4 + (1 + 3 * this.t) * this.d2 * this.C5)) / Math.cos(s)
        }
        return e.x = Proj4js.common.adjust_lon(this.long0 + i),
        e.y = t,
        e
    }
},
Proj4js.Proj.gauss = {
    init: function() {
        var e = Math.sin(this.lat0)
          , t = Math.cos(this.lat0);
        t *= t,
        this.rc = Math.sqrt(1 - this.es) / (1 - this.es * e * e),
        this.C = Math.sqrt(1 + this.es * t * t / (1 - this.es)),
        this.phic0 = Math.asin(e / this.C),
        this.ratexp = .5 * this.C * this.e,
        this.K = Math.tan(.5 * this.phic0 + Proj4js.common.FORTPI) / (Math.pow(Math.tan(.5 * this.lat0 + Proj4js.common.FORTPI), this.C) * Proj4js.common.srat(this.e * e, this.ratexp))
    },
    forward: function(e) {
        var t = e.x
          , i = e.y;
        return e.y = 2 * Math.atan(this.K * Math.pow(Math.tan(.5 * i + Proj4js.common.FORTPI), this.C) * Proj4js.common.srat(this.e * Math.sin(i), this.ratexp)) - Proj4js.common.HALF_PI,
        e.x = this.C * t,
        e
    },
    inverse: function(e) {
        for (var t = 1e-14, i = e.x / this.C, n = e.y, r = Math.pow(Math.tan(.5 * n + Proj4js.common.FORTPI) / this.K, 1 / this.C), s = Proj4js.common.MAX_ITER; s > 0 && (n = 2 * Math.atan(r * Proj4js.common.srat(this.e * Math.sin(e.y), -.5 * this.e)) - Proj4js.common.HALF_PI,
        !(t > Math.abs(n - e.y))); --s)
            e.y = n;
        return s ? (e.x = i,
        e.y = n,
        e) : (Proj4js.reportError("gauss:inverse:convergence failed"),
        null)
    }
},
Proj4js.Proj.omerc = {
    init: function() {
        this.mode || (this.mode = 0),
        this.lon1 || (this.lon1 = 0,
        this.mode = 1),
        this.lon2 || (this.lon2 = 0),
        this.lat2 || (this.lat2 = 0);
        var e = this.b / this.a
          , t = 1 - Math.pow(e, 2);
        Math.sqrt(t),
        this.sin_p20 = Math.sin(this.lat0),
        this.cos_p20 = Math.cos(this.lat0),
        this.con = 1 - this.es * this.sin_p20 * this.sin_p20,
        this.com = Math.sqrt(1 - t),
        this.bl = Math.sqrt(1 + this.es * Math.pow(this.cos_p20, 4) / (1 - t)),
        this.al = this.a * this.bl * this.k0 * this.com / this.con,
        Math.abs(this.lat0) < Proj4js.common.EPSLN ? (this.ts = 1,
        this.d = 1,
        this.el = 1) : (this.ts = Proj4js.common.tsfnz(this.e, this.lat0, this.sin_p20),
        this.con = Math.sqrt(this.con),
        this.d = this.bl * this.com / (this.cos_p20 * this.con),
        this.f = this.d * this.d - 1 > 0 ? this.lat0 >= 0 ? this.d + Math.sqrt(this.d * this.d - 1) : this.d - Math.sqrt(this.d * this.d - 1) : this.d,
        this.el = this.f * Math.pow(this.ts, this.bl)),
        0 != this.mode ? (this.g = .5 * (this.f - 1 / this.f),
        this.gama = Proj4js.common.asinz(Math.sin(this.alpha) / this.d),
        this.longc = this.longc - Proj4js.common.asinz(this.g * Math.tan(this.gama)) / this.bl,
        this.con = Math.abs(this.lat0),
        this.con > Proj4js.common.EPSLN && Math.abs(this.con - Proj4js.common.HALF_PI) > Proj4js.common.EPSLN ? (this.singam = Math.sin(this.gama),
        this.cosgam = Math.cos(this.gama),
        this.sinaz = Math.sin(this.alpha),
        this.cosaz = Math.cos(this.alpha),
        this.u = this.lat0 >= 0 ? this.al / this.bl * Math.atan(Math.sqrt(this.d * this.d - 1) / this.cosaz) : -(this.al / this.bl) * Math.atan(Math.sqrt(this.d * this.d - 1) / this.cosaz)) : Proj4js.reportError("omerc:Init:DataError")) : (this.sinphi = Math.sin(this.at1),
        this.ts1 = Proj4js.common.tsfnz(this.e, this.lat1, this.sinphi),
        this.sinphi = Math.sin(this.lat2),
        this.ts2 = Proj4js.common.tsfnz(this.e, this.lat2, this.sinphi),
        this.h = Math.pow(this.ts1, this.bl),
        this.l = Math.pow(this.ts2, this.bl),
        this.f = this.el / this.h,
        this.g = .5 * (this.f - 1 / this.f),
        this.j = (this.el * this.el - this.l * this.h) / (this.el * this.el + this.l * this.h),
        this.p = (this.l - this.h) / (this.l + this.h),
        this.dlon = this.lon1 - this.lon2,
        this.dlon < -Proj4js.common.PI && (this.lon2 = this.lon2 - 2 * Proj4js.common.PI),
        this.dlon > Proj4js.common.PI && (this.lon2 = this.lon2 + 2 * Proj4js.common.PI),
        this.dlon = this.lon1 - this.lon2,
        this.longc = .5 * (this.lon1 + this.lon2) - Math.atan(this.j * Math.tan(.5 * this.bl * this.dlon) / this.p) / this.bl,
        this.dlon = Proj4js.common.adjust_lon(this.lon1 - this.longc),
        this.gama = Math.atan(Math.sin(this.bl * this.dlon) / this.g),
        this.alpha = Proj4js.common.asinz(this.d * Math.sin(this.gama)),
        Math.abs(this.lat1 - this.lat2) <= Proj4js.common.EPSLN ? Proj4js.reportError("omercInitDataError") : this.con = Math.abs(this.lat1),
        this.con <= Proj4js.common.EPSLN || Math.abs(this.con - Proj4js.common.HALF_PI) <= Proj4js.common.EPSLN ? Proj4js.reportError("omercInitDataError") : Math.abs(Math.abs(this.lat0) - Proj4js.common.HALF_PI) <= Proj4js.common.EPSLN && Proj4js.reportError("omercInitDataError"),
        this.singam = Math.sin(this.gam),
        this.cosgam = Math.cos(this.gam),
        this.sinaz = Math.sin(this.alpha),
        this.cosaz = Math.cos(this.alpha),
        this.u = this.lat0 >= 0 ? this.al / this.bl * Math.atan(Math.sqrt(this.d * this.d - 1) / this.cosaz) : -(this.al / this.bl) * Math.atan(Math.sqrt(this.d * this.d - 1) / this.cosaz))
    },
    forward: function(e) {
        var t, i, n, r, s, o, a, l, h, c, u, d = e.x, p = e.y;
        t = Math.sin(p),
        c = Proj4js.common.adjust_lon(d - this.longc),
        o = Math.sin(this.bl * c),
        Math.abs(Math.abs(p) - Proj4js.common.HALF_PI) > Proj4js.common.EPSLN ? (u = Proj4js.common.tsfnz(this.e, p, t),
        r = this.el / Math.pow(u, this.bl),
        h = .5 * (r - 1 / r),
        i = .5 * (r + 1 / r),
        a = (h * this.singam - o * this.cosgam) / i,
        n = Math.cos(this.bl * c),
        1e-7 > Math.abs(n) ? s = this.al * this.bl * c : (s = this.al * Math.atan((h * this.cosgam + o * this.singam) / n) / this.bl,
        0 > n && (s += Proj4js.common.PI * this.al / this.bl))) : (a = p >= 0 ? this.singam : -this.singam,
        s = this.al * p / this.bl),
        Math.abs(Math.abs(a) - 1) <= Proj4js.common.EPSLN && Proj4js.reportError("omercFwdInfinity"),
        l = .5 * this.al * Math.log((1 - a) / (1 + a)) / this.bl,
        s -= this.u;
        var f = this.x0 + l * this.cosaz + s * this.sinaz
          , m = this.y0 + s * this.cosaz - l * this.sinaz;
        return e.x = f,
        e.y = m,
        e
    },
    inverse: function(e) {
        var t, i, n, r, s, o, a, l, h, c, u, d, p;
        return e.x -= this.x0,
        e.y -= this.y0,
        p = 0,
        r = e.x * this.cosaz - e.y * this.sinaz,
        s = e.y * this.cosaz + e.x * this.sinaz,
        s += this.u,
        o = Math.exp(-this.bl * r / this.al),
        a = .5 * (o - 1 / o),
        i = .5 * (o + 1 / o),
        h = Math.sin(this.bl * s / this.al),
        c = (h * this.cosgam + a * this.singam) / i,
        Math.abs(Math.abs(c) - 1) <= Proj4js.common.EPSLN ? (u = this.longc,
        d = c >= 0 ? Proj4js.common.HALF_PI : -Proj4js.common.HALF_PI) : (n = 1 / this.bl,
        l = Math.pow(this.el / Math.sqrt((1 + c) / (1 - c)), n),
        d = Proj4js.common.phi2z(this.e, l),
        t = this.longc - Math.atan2(a * this.cosgam - h * this.singam, n) / this.bl,
        u = Proj4js.common.adjust_lon(t)),
        e.x = u,
        e.y = d,
        e
    }
},
Proj4js.Proj.lcc = {
    init: function() {
        if (this.lat2 || (this.lat2 = this.lat0),
        this.k0 || (this.k0 = 1),
        Math.abs(this.lat1 + this.lat2) < Proj4js.common.EPSLN)
            return Proj4js.reportError("lcc:init: Equal Latitudes"),
            void 0;
        var e = this.b / this.a;
        this.e = Math.sqrt(1 - e * e);
        var t = Math.sin(this.lat1)
          , i = Math.cos(this.lat1)
          , n = Proj4js.common.msfnz(this.e, t, i)
          , r = Proj4js.common.tsfnz(this.e, this.lat1, t)
          , s = Math.sin(this.lat2)
          , o = Math.cos(this.lat2)
          , a = Proj4js.common.msfnz(this.e, s, o)
          , l = Proj4js.common.tsfnz(this.e, this.lat2, s)
          , h = Proj4js.common.tsfnz(this.e, this.lat0, Math.sin(this.lat0));
        this.ns = Math.abs(this.lat1 - this.lat2) > Proj4js.common.EPSLN ? Math.log(n / a) / Math.log(r / l) : t,
        this.f0 = n / (this.ns * Math.pow(r, this.ns)),
        this.rh = this.a * this.f0 * Math.pow(h, this.ns),
        this.title || (this.title = "Lambert Conformal Conic")
    },
    forward: function(e) {
        var t = e.x
          , i = e.y;
        if (!(90 >= i && i >= -90 && 180 >= t && t >= -180))
            return Proj4js.reportError("lcc:forward: llInputOutOfRange: " + t + " : " + i),
            null;
        var n, r, s = Math.abs(Math.abs(i) - Proj4js.common.HALF_PI);
        if (s > Proj4js.common.EPSLN)
            n = Proj4js.common.tsfnz(this.e, i, Math.sin(i)),
            r = this.a * this.f0 * Math.pow(n, this.ns);
        else {
            if (s = i * this.ns,
            0 >= s)
                return Proj4js.reportError("lcc:forward: No Projection"),
                null;
            r = 0
        }
        var o = this.ns * Proj4js.common.adjust_lon(t - this.long0);
        return e.x = this.k0 * r * Math.sin(o) + this.x0,
        e.y = this.k0 * (this.rh - r * Math.cos(o)) + this.y0,
        e
    },
    inverse: function(e) {
        var t, i, n, r, s, o = (e.x - this.x0) / this.k0, a = this.rh - (e.y - this.y0) / this.k0;
        this.ns > 0 ? (t = Math.sqrt(o * o + a * a),
        i = 1) : (t = -Math.sqrt(o * o + a * a),
        i = -1);
        var l = 0;
        if (0 != t && (l = Math.atan2(i * o, i * a)),
        0 != t || this.ns > 0) {
            if (i = 1 / this.ns,
            n = Math.pow(t / (this.a * this.f0), i),
            r = Proj4js.common.phi2z(this.e, n),
            -9999 == r)
                return null
        } else
            r = -Proj4js.common.HALF_PI;
        return s = Proj4js.common.adjust_lon(l / this.ns + this.long0),
        e.x = s,
        e.y = r,
        e
    }
},
Proj4js.Proj.laea = {
    S_POLE: 1,
    N_POLE: 2,
    EQUIT: 3,
    OBLIQ: 4,
    init: function() {
        var e = Math.abs(this.lat0);
        if (this.mode = Math.abs(e - Proj4js.common.HALF_PI) < Proj4js.common.EPSLN ? 0 > this.lat0 ? this.S_POLE : this.N_POLE : Math.abs(e) < Proj4js.common.EPSLN ? this.EQUIT : this.OBLIQ,
        this.es > 0) {
            var t;
            switch (this.qp = Proj4js.common.qsfnz(this.e, 1),
            this.mmf = .5 / (1 - this.es),
            this.apa = this.authset(this.es),
            this.mode) {
            case this.N_POLE:
            case this.S_POLE:
                this.dd = 1;
                break;
            case this.EQUIT:
                this.rq = Math.sqrt(.5 * this.qp),
                this.dd = 1 / this.rq,
                this.xmf = 1,
                this.ymf = .5 * this.qp;
                break;
            case this.OBLIQ:
                this.rq = Math.sqrt(.5 * this.qp),
                t = Math.sin(this.lat0),
                this.sinb1 = Proj4js.common.qsfnz(this.e, t) / this.qp,
                this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1),
                this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * t * t) * this.rq * this.cosb1),
                this.ymf = (this.xmf = this.rq) / this.dd,
                this.xmf *= this.dd
            }
        } else
            this.mode == this.OBLIQ && (this.sinph0 = Math.sin(this.lat0),
            this.cosph0 = Math.cos(this.lat0))
    },
    forward: function(e) {
        var t, i, n = e.x, r = e.y;
        if (n = Proj4js.common.adjust_lon(n - this.long0),
        this.sphere) {
            var s, o, a;
            switch (a = Math.sin(r),
            o = Math.cos(r),
            s = Math.cos(n),
            this.mode) {
            case this.OBLIQ:
            case this.EQUIT:
                if (i = this.mode == this.EQUIT ? 1 + o * s : 1 + this.sinph0 * a + this.cosph0 * o * s,
                Proj4js.common.EPSLN >= i)
                    return Proj4js.reportError("laea:fwd:y less than eps"),
                    null;
                i = Math.sqrt(2 / i),
                t = i * o * Math.sin(n),
                i *= this.mode == this.EQUIT ? a : this.cosph0 * a - this.sinph0 * o * s;
                break;
            case this.N_POLE:
                s = -s;
            case this.S_POLE:
                if (Math.abs(r + this.phi0) < Proj4js.common.EPSLN)
                    return Proj4js.reportError("laea:fwd:phi < eps"),
                    null;
                i = Proj4js.common.FORTPI - .5 * r,
                i = 2 * (this.mode == this.S_POLE ? Math.cos(i) : Math.sin(i)),
                t = i * Math.sin(n),
                i *= s
            }
        } else {
            var s, l, a, h, c = 0, u = 0, d = 0;
            switch (s = Math.cos(n),
            l = Math.sin(n),
            a = Math.sin(r),
            h = Proj4js.common.qsfnz(this.e, a),
            (this.mode == this.OBLIQ || this.mode == this.EQUIT) && (c = h / this.qp,
            u = Math.sqrt(1 - c * c)),
            this.mode) {
            case this.OBLIQ:
                d = 1 + this.sinb1 * c + this.cosb1 * u * s;
                break;
            case this.EQUIT:
                d = 1 + u * s;
                break;
            case this.N_POLE:
                d = Proj4js.common.HALF_PI + r,
                h = this.qp - h;
                break;
            case this.S_POLE:
                d = r - Proj4js.common.HALF_PI,
                h = this.qp + h
            }
            if (Math.abs(d) < Proj4js.common.EPSLN)
                return Proj4js.reportError("laea:fwd:b < eps"),
                null;
            switch (this.mode) {
            case this.OBLIQ:
            case this.EQUIT:
                d = Math.sqrt(2 / d),
                i = this.mode == this.OBLIQ ? this.ymf * d * (this.cosb1 * c - this.sinb1 * u * s) : (d = Math.sqrt(2 / (1 + u * s))) * c * this.ymf,
                t = this.xmf * d * u * l;
                break;
            case this.N_POLE:
            case this.S_POLE:
                h >= 0 ? (t = (d = Math.sqrt(h)) * l,
                i = s * (this.mode == this.S_POLE ? d : -d)) : t = i = 0
            }
        }
        return e.x = this.a * t + this.x0,
        e.y = this.a * i + this.y0,
        e
    },
    inverse: function(e) {
        e.x -= this.x0,
        e.y -= this.y0;
        var t, i, n = e.x / this.a, r = e.y / this.a;
        if (this.sphere) {
            var s, o = 0, a = 0;
            if (s = Math.sqrt(n * n + r * r),
            i = .5 * s,
            i > 1)
                return Proj4js.reportError("laea:Inv:DataError"),
                null;
            switch (i = 2 * Math.asin(i),
            (this.mode == this.OBLIQ || this.mode == this.EQUIT) && (a = Math.sin(i),
            o = Math.cos(i)),
            this.mode) {
            case this.EQUIT:
                i = Math.abs(s) <= Proj4js.common.EPSLN ? 0 : Math.asin(r * a / s),
                n *= a,
                r = o * s;
                break;
            case this.OBLIQ:
                i = Math.abs(s) <= Proj4js.common.EPSLN ? this.phi0 : Math.asin(o * this.sinph0 + r * a * this.cosph0 / s),
                n *= a * this.cosph0,
                r = (o - Math.sin(i) * this.sinph0) * s;
                break;
            case this.N_POLE:
                r = -r,
                i = Proj4js.common.HALF_PI - i;
                break;
            case this.S_POLE:
                i -= Proj4js.common.HALF_PI
            }
            t = 0 != r || this.mode != this.EQUIT && this.mode != this.OBLIQ ? Math.atan2(n, r) : 0
        } else {
            var l, h, c, u, d = 0;
            switch (this.mode) {
            case this.EQUIT:
            case this.OBLIQ:
                if (n /= this.dd,
                r *= this.dd,
                u = Math.sqrt(n * n + r * r),
                Proj4js.common.EPSLN > u)
                    return e.x = 0,
                    e.y = this.phi0,
                    e;
                h = 2 * Math.asin(.5 * u / this.rq),
                l = Math.cos(h),
                n *= h = Math.sin(h),
                this.mode == this.OBLIQ ? (d = l * this.sinb1 + r * h * this.cosb1 / u,
                c = this.qp * d,
                r = u * this.cosb1 * l - r * this.sinb1 * h) : (d = r * h / u,
                c = this.qp * d,
                r = u * l);
                break;
            case this.N_POLE:
                r = -r;
            case this.S_POLE:
                if (c = n * n + r * r,
                !c)
                    return e.x = 0,
                    e.y = this.phi0,
                    e;
                d = 1 - c / this.qp,
                this.mode == this.S_POLE && (d = -d)
            }
            t = Math.atan2(n, r),
            i = this.authlat(Math.asin(d), this.apa)
        }
        return e.x = Proj4js.common.adjust_lon(this.long0 + t),
        e.y = i,
        e
    },
    P00: .3333333333333333,
    P01: .17222222222222222,
    P02: .10257936507936508,
    P10: .06388888888888888,
    P11: .0664021164021164,
    P20: .016415012942191543,
    authset: function(e) {
        var t, i = [];
        return i[0] = e * this.P00,
        t = e * e,
        i[0] += t * this.P01,
        i[1] = t * this.P10,
        t *= e,
        i[0] += t * this.P02,
        i[1] += t * this.P11,
        i[2] = t * this.P20,
        i
    },
    authlat: function(e, t) {
        var i = e + e;
        return e + t[0] * Math.sin(i) + t[1] * Math.sin(i + i) + t[2] * Math.sin(i + i + i)
    }
},
Proj4js.Proj.aeqd = {
    init: function() {
        this.sin_p12 = Math.sin(this.lat0),
        this.cos_p12 = Math.cos(this.lat0)
    },
    forward: function(e) {
        var t = e.x;
        e.y;
        var i, n = Math.sin(e.y), r = Math.cos(e.y), s = Proj4js.common.adjust_lon(t - this.long0), o = Math.cos(s), a = this.sin_p12 * n + this.cos_p12 * r * o;
        if (Math.abs(Math.abs(a) - 1) < Proj4js.common.EPSLN) {
            if (i = 1,
            0 > a)
                return Proj4js.reportError("aeqd:Fwd:PointError"),
                void 0
        } else {
            var l = Math.acos(a);
            i = l / Math.sin(l)
        }
        return e.x = this.x0 + this.a * i * r * Math.sin(s),
        e.y = this.y0 + this.a * i * (this.cos_p12 * n - this.sin_p12 * r * o),
        e
    },
    inverse: function(e) {
        e.x -= this.x0,
        e.y -= this.y0;
        var t = Math.sqrt(e.x * e.x + e.y * e.y);
        if (t > 2 * Proj4js.common.HALF_PI * this.a)
            return Proj4js.reportError("aeqdInvDataError"),
            void 0;
        var i, n = t / this.a, r = Math.sin(n), s = Math.cos(n), o = this.long0;
        if (Math.abs(t) <= Proj4js.common.EPSLN)
            i = this.lat0;
        else {
            i = Proj4js.common.asinz(s * this.sin_p12 + e.y * r * this.cos_p12 / t);
            var a = Math.abs(this.lat0) - Proj4js.common.HALF_PI;
            Math.abs(a) <= Proj4js.common.EPSLN ? o = this.lat0 >= 0 ? Proj4js.common.adjust_lon(this.long0 + Math.atan2(e.x, -e.y)) : Proj4js.common.adjust_lon(this.long0 - Math.atan2(-e.x, e.y)) : (a = s - this.sin_p12 * Math.sin(i),
            Math.abs(a) < Proj4js.common.EPSLN && Math.abs(e.x) < Proj4js.common.EPSLN || (Math.atan2(e.x * r * this.cos_p12, a * t),
            o = Proj4js.common.adjust_lon(this.long0 + Math.atan2(e.x * r * this.cos_p12, a * t))))
        }
        return e.x = o,
        e.y = i,
        e
    }
},
Proj4js.Proj.moll = {
    init: function() {},
    forward: function(e) {
        for (var t = e.x, i = e.y, n = Proj4js.common.adjust_lon(t - this.long0), r = i, s = Proj4js.common.PI * Math.sin(i), o = 0; !0; o++) {
            var a = -(r + Math.sin(r) - s) / (1 + Math.cos(r));
            if (r += a,
            Math.abs(a) < Proj4js.common.EPSLN)
                break;
            o >= 50 && Proj4js.reportError("moll:Fwd:IterationError")
        }
        r /= 2,
        Proj4js.common.PI / 2 - Math.abs(i) < Proj4js.common.EPSLN && (n = 0);
        var l = .900316316158 * this.a * n * Math.cos(r) + this.x0
          , h = 1.4142135623731 * this.a * Math.sin(r) + this.y0;
        return e.x = l,
        e.y = h,
        e
    },
    inverse: function(e) {
        var t, i;
        e.x -= this.x0;
        var i = e.y / (1.4142135623731 * this.a);
        Math.abs(i) > .999999999999 && (i = .999999999999);
        var t = Math.asin(i)
          , n = Proj4js.common.adjust_lon(this.long0 + e.x / (.900316316158 * this.a * Math.cos(t)));
        -Proj4js.common.PI > n && (n = -Proj4js.common.PI),
        n > Proj4js.common.PI && (n = Proj4js.common.PI),
        i = (2 * t + Math.sin(2 * t)) / Proj4js.common.PI,
        Math.abs(i) > 1 && (i = 1);
        var r = Math.asin(i);
        return e.x = n,
        e.y = r,
        e
    }
};
