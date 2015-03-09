[![Build Status](https://secure.travis-ci.org/mapbox/polyline.png?branch=master)](http://travis-ci.org/mapbox/polyline)
[![npm version](https://badge.fury.io/js/polyline.svg)](http://badge.fury.io/js/polyline)

# polyline

A simple [google-esque polyline](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
implementation in Javascript. Compatible with node.js and the browser.

Encodes/decodes into lat/lng coordinate pairs. Flip the pairs to be compatible with GeoJSON.

## Installation

Via npm

    npm install polyline
    
Via bower

    bower install polyline
    
Include file direcly on your page:

    <script src="src/polyline.js"></script>

## Example

```js
var polyline = require('polyline');

// returns an array of lat, lon pairs
polyline.decode('_p~iF~ps|U_ulLnnqC_mqNvxq`@')

// returns a string-encoded polyline
polyline.encode([[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]);
```

# [Documentation](https://github.com/mapbox/polyline/blob/master/API.md)

## See Also

* [polyline algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
* [Mark McClure's Google Maps Project](http://facstaff.unca.edu/mcmcclur/GoogleMaps.html)
* [Routing geometry decoder in project-osrm](https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js)
