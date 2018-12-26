'use strict';

var test = require('tap').test,
    polyline = require('../');

test('polyline', function(t) {
    var example = [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]],
        // encoded value will enclude slashes -> tests escaping
        example_slashes = [[35.6, -82.55], [35.59985, -82.55015], [35.6, -82.55]],
        example_flipped = [[-120.2, 38.5], [-120.95, 40.7], [-126.453, 43.252]],
        example_rounding = [[0, 0.000006], [0, 0.000002]],
        example_rounding_negative = [[36.05322, -112.084004], [36.053573, -112.083914], [36.053845, -112.083965]];

    var geojsonLineString = { 'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': example_flipped
            },
            'properties': {}
        },
        geojsonPoint = {
            'type': 'Point',
            'coordinates': example_flipped[0]
        },
        geojsonPolygon = {
            'type': 'Polygon',
            'coordinates': [[[-120.2, 38.5], [-120.95, 40.7], [-126.453, 43.252], [-120.2, 38.5]]]
        };

    t.test('#decode()', function(t) {
        t.test('decodes an empty Array', function(t) {
            t.deepEqual(polyline.decode(''), []);
            t.end();
        });

        t.test('decodes a String into an Array of lat/lon pairs', function(t) {
            t.deepEqual(polyline.decode('_p~iF~ps|U_ulLnnqC_mqNvxq`@'), example);
            t.end();
        });

        t.test('decodes with a custom precision', function(t) {
            t.deepEqual(polyline.decode('_izlhA~rlgdF_{geC~ywl@_kwzCn`{nI', 6), example);
            t.end();
        });

        t.end();
    });

    t.test('#identity', function(t) {
        t.test('feed encode into decode and check if the result is the same as the input', function(t) {
            t.deepEqual(polyline.decode(polyline.encode(example_slashes)), example_slashes);
            t.end();
        });

        t.test('feed decode into encode and check if the result is the same as the input', function(t) {
            t.equal(polyline.encode(polyline.decode('_chxEn`zvN\\\\]]')), '_chxEn`zvN\\\\]]');
            t.end();
        });

        t.end();
    });

    t.test('#encode()', function(t) {
        t.test('encodes an empty Array', function(t) {
            t.equal(polyline.encode([]), '');
            t.end();
        });

        t.test('encodes an Array of lat/lon pairs into a String', function(t) {
            t.equal(polyline.encode(example), '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
            t.end();
        });

        t.test('encodes with proper rounding', function(t) {
            t.equal(polyline.encode(example_rounding), '?A?@');
            t.end();
        });

        t.test('encodes with proper negative rounding', function(t) {
            t.equal(polyline.encode(example_rounding_negative), 'ss`{E~kbkTeAQw@J');
            t.end();
        });

        t.test('encodes with a custom precision', function(t) {
            t.equal(polyline.encode(example, 6), '_izlhA~rlgdF_{geC~ywl@_kwzCn`{nI');
            t.end();
        });

        t.test('encodes negative values correctly', function(t) {
            t.ok(polyline.decode(polyline.encode([[-107.3741825, 0]], 7), 7)[0][0] < 0);
            t.end();
        });


        t.end();
    });

    t.test('#fromGeoJSON()', function(t) {
        t.test('throws for empty geojson', function(t) {
            t.throws(function() {
                polyline.fromGeoJSON();
            }, /Input must be a valid GeoJSON/);
            t.end();
        });

        t.test('throws for unsupported geometry type', function(t) {
            t.throws(function() {
                polyline.fromGeoJSON({ type: 'MultiPolygon' });
            }, /Input must be a GeoJSON Point, LineString or Polygon/);
            t.end();
        });

        t.test('allows geojson linestring', function(t) {
            t.equal(polyline.fromGeoJSON(geojsonLineString.geometry), '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
            t.end();
        });

        t.test('flips linestring coordinates and encodes', function(t) {
            t.equal(polyline.fromGeoJSON(geojsonLineString), '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
            t.end();
        });

        t.test('flips point coordinate end encodes', function(t) {
            t.equal(polyline.fromGeoJSON(geojsonPoint), '_p~iF~ps|U');
            t.end();
        });

        t.test('flips polygon coordinates end encodes', function(t) {
            t.equal(polyline.fromGeoJSON(geojsonPolygon), '_p~iF~ps|U_ulLnnqC_mqNvxq`@~b_\\ghde@');
            t.end();
        });

        t.end();
    });

    t.test('#toGeoJSON()', function(t) {
        t.test('flips linestring coordinates and decodes geometry', function(t) {
            t.deepEqual(polyline.toGeoJSON('_p~iF~ps|U_ulLnnqC_mqNvxq`@'), geojsonLineString.geometry);
            t.end();
        });

        t.test('flips point coordinate and decodes geometry', function(t) {
            t.deepEqual(polyline.toGeoJSON('_p~iF~ps|U'), geojsonPoint);
            t.end();
        });

        t.end();
    });

    t.end();
});
