'use strict';

/**
 * Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
 *
 * Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
 * by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)
 *
 * @module polyline
 */

var polyline = {};

function py2_round(value) {
    // Google's polyline algorithm uses the same rounding strategy as Python 2, which is different from JS for negative values
    return value < 0 ? Math.ceil(value - 0.5) : Math.round(value);
}

function encode(current, previous) {
    var coordinate = (current - previous) * 2;
    if (coordinate < 0) {
        coordinate = -coordinate - 1
    }
    var output = '';
    while (coordinate >= 0x20) {
        output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
        coordinate /= 32;
    }
    output += String.fromCharCode((coordinate | 0) + 63);
    return output;
}

/**
 * Decodes to a [latitude, longitude] coordinates array.
 *
 * This is adapted from the implementation in Project-OSRM.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Array}
 *
 * @see https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
 */
polyline.decode = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift,
        result,
        byte,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift and result
        shift = 1;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result += (byte & 0x1f) * shift;
            shift *= 32;
        } while (byte >= 0x20);

        latitude_change = (result & 1) ? ((-result - 1) / 2) : (result / 2);

        shift = 1;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result += (byte & 0x1f) * shift;
            shift *= 32;
        } while (byte >= 0x20);

        longitude_change = (result & 1) ? ((-result - 1) / 2) : (result / 2);

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

/**
 * Encodes the given [latitude, longitude] coordinates array.
 *
 * @param {Array.<Array.<Number>>} coordinates
 * @param {Number} precision
 * @returns {String}
 */
polyline.encode = function(coordinates, precision) {
    var factor = Math.pow(10, Number.isInteger(precision) ? precision : 5),
        output = '',
        bLat = 0,
        bLon = 0;

    for (var i = 0; i < coordinates.length; i++) {
        var a = coordinates[i];
        var aLat = py2_round(a[0] * factor);
        var aLon = py2_round(a[1] * factor);
        output += encode(aLat, bLat) + encode(aLon, bLon);
        bLat = aLat;
        bLon = aLon;
    }

    return output;
};

function flipped(coords) {
    var flipped = [];
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        flipped.push([coord[1], coord[0]]);
    }
    return flipped;
}

/**
 * Encodes a GeoJSON LineString feature/geometry.
 *
 * @param {Object} geojson
 * @param {Number} precision
 * @returns {String}
 */
polyline.fromGeoJSON = function(geojson, precision) {
    if (geojson && geojson.type === 'Feature') {
        geojson = geojson.geometry;
    }
    if (!geojson || geojson.type !== 'LineString') {
        throw new Error('Input must be a GeoJSON LineString');
    }
    return polyline.encode(flipped(geojson.coordinates), precision);
};

/**
 * Decodes to a GeoJSON LineString geometry.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Object}
 */
polyline.toGeoJSON = function(str, precision) {
    var coords = polyline.decode(str, precision);
    return {
        type: 'LineString',
        coordinates: flipped(coords)
    };
};

if (typeof module === 'object' && module.exports) {
    module.exports = polyline;
}
