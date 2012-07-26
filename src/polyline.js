var polyline = {};

// Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
//
// Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
// by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)

polyline.encodeCoordinate = function(coordinate) {
    coordinate = Math.round(coordinate * 1e5);
    coordinate <<= 1;
    if (coordinate < 0) {
        coordinate = ~coordinate;
    }
    var output = '';
    while (coordinate >= 0x20) {
        output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
        coordinate >>= 5;
    }
    output += String.fromCharCode(coordinate + 63);
    return output;
};

// See http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/decode.js
polyline.decodeCoordinate = function(str) {
    for (var i = 0; i < str.length; i++) {
        var binary = str.charCodeAt(i) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
    }
};

// This is adapted from the implementation in Project-OSRM
// https://github.com/DennisOSRM/Project-OSRM-Web/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
polyline.decodeLine = function(str) {

    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change;

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        var precision = Math.pow(10, -5);

        coordinates.push([lat * precision, lng * precision]);
    }

    return coordinates;
};

// Simple encoding of a point, simply encoding two coordinates
polyline.encodePoint = function(x, y) {
    return this.encodeCoordinate(x) + this.encodeCoordinate(y);
};

polyline.encodeLine = function(coordinates) {
    var previous_point,
        output = '',
        longitude = 0,
        latitude = 0;

    for (var i = 0; i < coordinates.length; i++) {
        var pt = [
            coordinates[i][0],
            coordinates[i][1]];

        if (latitude || longitude) {
            pt = [
                pt[0] - latitude,
                pt[1] - longitude];
        }

        output += this.encodePoint(pt[0], pt[1]);

        latitude = pt[0];
        longitude = pt[1];
    }
    return output;
};

if (typeof module !== undefined) module.exports = polyline;
