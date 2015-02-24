;(function (window, factory) {

    "use strict";

    if ( typeof define === 'function' && define.amd) {
        // AMD
        define([], function(){
            return factory.apply(window, arguments);
        });

    } else if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = factory.call(window);
    } else {
        // Browser globals
        window.polyline = factory.call(window);
    }

}(typeof global === 'object' ? global : this, function () {

    /*******************************************************************************
     * @name LatLng
     * @class This class represents new camera position
     * @param {Number} latitude
     * @param {Number} longitude
     ******************************************************************************/
    var LatLng = function(latitude, longitude) {
        var self = this;
        /**
        * @property {Number} latitude
        */
        self.lat = parseFloat(latitude || 0, 10);

        /**
        * @property {Number} longitude
        */
        self.lng = parseFloat(longitude || 0, 10);

        /**
        * Comparison function.
        * @method
        * @return {Boolean}
        */
        self.equals = function(other) {
            other = other || {};
            return other.lat === self.lat && other.lng === self.lng;
        };

        /**
        * @method
        * @return {String} latitude,lontitude
        */
        self.toString = function() {
            return self.lat + "," + self.lng;
        };

        /**
        * @method
        * @param {Number}
        * @return {String} latitude,lontitude
        */
        self.toUrlValue = function(precision) {
            precision = precision || 6;
            return self.lat.toFixed(precision) + "," + self.lng.toFixed(precision);
        };
    };


    var polyline = {};

    // Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
    //
    // Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
    // by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)

    function encode(coordinate, factor) {
        coordinate = Math.round(coordinate * factor);
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
    }

    // This is adapted from the implementation in Project-OSRM
    // https://github.com/DennisOSRM/Project-OSRM-Web/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
    polyline.decode = function(str, precision) {
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, precision || 5);

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

            coordinates.push([lat / factor, lng / factor]);
        }

        return coordinates;
    };

    polyline.encode = function(coordinates, precision) {
        if (!coordinates.length) return '';

        var factor = Math.pow(10, precision || 5),
            output = encode(coordinates[0][0], factor) + encode(coordinates[0][1], factor);

        for (var i = 1; i < coordinates.length; i++) {
            var a = coordinates[i], b = coordinates[i - 1];
            output += encode(a[0] - b[0], factor);
            output += encode(a[1] - b[1], factor);
        }

        return output;
    };

    // Returns an array of object LatLng
    polyline.decodeToLatLng = function decodeToLatLng(str, precision){
      var coordinates  = [],
          _coordinates = this.decode( str, precision );

      for (var i = 0; i < _coordinates.length; i++) {
        coordinates.push( new LatLng(_coordinates[i][0],_coordinates[i][1]) );
      }

      return coordinates;
    };

    // Encode an array of object LatLng
    polyline.encodeFromLatLng = function encodeFromLatLng(coordinates, precision){
        if ( !coordinates.length ) 
            return '';
        
        var _coordinates = [];
        for (var x = 0; x < coordinates.length; x++) {
            if ( coordinates[x] && coordinates[x].lat && coordinates[x].lng ){
                _coordinates.push( [ coordinates[x].lat, coordinates[x].lng ] );
            }
        }

        return this.encode( _coordinates, precision );
    };

    // Expose contructor Object LatLng
    polyline.LatLng = LatLng;

    return polyline;

}));