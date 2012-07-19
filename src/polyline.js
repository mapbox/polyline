var polyline = {};

/*
 * Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
 *
 * Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
 * by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)
 */

/*
 * Encoding coordinates
 *
 * @param {Number} coordinate a single coordinate number
 * @return {String} an encoded point
 *
 * > Note that the backslash is interpreted as an escape character within string literals.
 * Any output of this utility should convert backslash characters to
 * double-backslashes within string literals.
 */
polyline.encodeCoordinate = function(coordinate) {
    // step 2
    coordinate = Math.round(coordinate * 1e5);
    // step 4
    coordinate <<= 1;
    // step 5
    if (coordinate < 0) {
        coordinate = ~coordinate;
    }
    var output = '';
    // step 6
    // TODO: understand
    while (coordinate >= 0x20) {
        output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
        // Read the next chunk of 5 bits
        coordinate >>= 5;
    }
    // Read the last chunk
    output += String.fromCharCode(coordinate + 63);
    return output;
};

/*
 * See http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/decode.js
 */
polyline.decodeCoordinate = function(str) {
    for (var i = 0; i < str.length; i++) {
        var binary = str.charCodeAt(i) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
    }
};

/*
 * Simple encoding of a point, simply encoding two coordinates
 */
polyline.encodePoint = function(x, y) {
    return this.encodeCoordinate(x) + this.encodeCoordinate(y);
};

/*
 * Currently failing tests.
 *
 * @param {Array} coordinates a two-dimensional array of coordinates in latitude and longitude
 * @return {String} an encoded polyline
 */
polyline.encodeLine = function(coordinates) {
    var previous_point,
        output = '';
    for (var i = 0; i < coordinates.length; i++) {
        var pt = [coordinates[i][0], coordinates[i][1]];
        if (previous_point) {
             pt[i] = [
                  previous_point[0]-pt[0],
                  previous_point[1]-pt[1]];
        }
        output += this.encodePoint(pt[0], pt[1]);
        previous_point = coordinates[i];
    }
    return output;
};

if (typeof module !== undefined) module.exports = polyline;
