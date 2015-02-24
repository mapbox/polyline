[![Build Status](https://secure.travis-ci.org/mapbox/polyline.png?branch=master)](http://travis-ci.org/mapbox/polyline)

# polyline

A simple [google-esque polyline](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
implementation in Javascript. Compatible with nodejs (`npm install polyline` and the browser (copy `src/polyline.js`)).

Encodes/decodes into lat/lng coordinate pairs. Flip the pairs to be compatible with GeoJSON.

## Installation

    npm install polyline
    
    bower install polyline

## Example

```js
var polyline = require('polyline');

// returns an array of lat, lon pairs
polyline.decode('_p~iF~ps|U_ulLnnqC_mqNvxq`@')

// returns a string-encoded polyline
polyline.encode([[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]);

// returns am array of LatLng object
polyline.decodeToLatLng('_p~iF~ps|U_ulLnnqC_mqNvxq`@')

// returns a string-encoded polyline
polyline.encodeFromLatLng([ LatLng1, LatLng2, ... ])

```

# [Documentation](API.md)

## See Also

* [polyline algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
* [Mark McClure's Google Maps Project](http://facstaff.unca.edu/mcmcclur/GoogleMaps.html)
* [Routing geometry decoder in project-osrm](https://github.com/DennisOSRM/Project-OSRM-Web/blob/master/WebContent/routing/OSRM.RoutingGeometry.js)
