[![Build Status](https://secure.travis-ci.org/mapbox/polyline.png?branch=master)](http://travis-ci.org/mapbox/polyline) [![Coverage Status](https://coveralls.io/repos/mapbox/polyline/badge.svg)](https://coveralls.io/r/mapbox/polyline)

# polyline

A simple [google-esque polyline](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
implementation in Javascript. Compatible with nodejs (`npm install polyline` and the browser (copy `src/polyline.js`)).

Encodes/decodes into lat/lng coordinate pairs. Use `fromGeoJSON()` to encode from GeoJSON objects.

## Installation

    npm install polyline

## Example

```js
var polyline = require('polyline');

// returns an array of lat, lon pairs
polyline.decode('_p~iF~ps|U_ulLnnqC_mqNvxq`@');

// returns a string-encoded polyline
polyline.encode([[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]);

// returns a string-encoded polyline from a GeoJSON LineString
polyline.fromGeoJSON({ "type": "Feature",
  "geometry": {
    "type": "LineString",
    "coordinates": [[-120.2, 38.5], [-120.95, 40.7], [-126.453, 43.252]]
  },
  "properties": {}
});
```

# [Documentation](https://github.com/mapbox/polyline/blob/master/API.md)

## See Also

* [polyline algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
* [Mark McClure's Google Maps Project](http://facstaff.unca.edu/mcmcclur/GoogleMaps.html)
* [Routing geometry decoder in project-osrm](https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js)
