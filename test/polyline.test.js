var assert = require('assert'),
    polyline = require('../');

describe('polyline', function() {
    var example = [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]],
        // encoded value will enclude slashes -> tests escaping
        example_slashes = [[35.6,-82.55], [35.59985, -82.55015], [35.6,-82.55]],
        example_flipped = [[-120.2, 38.5], [-120.95, 40.7], [-126.453, 43.252]];
        geojson = { "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": example_flipped
            },
            "properties": {}
        }

    describe('#decode()', function() {
        it('decodes an empty Array', function() {
            assert.deepEqual(polyline.decode(''), []);
        });

        it('decodes a String into an Array of lat/lon pairs', function() {
            assert.deepEqual(polyline.decode('_p~iF~ps|U_ulLnnqC_mqNvxq`@'), example);
        });

        it('decodes with a custom precision', function() {
            assert.deepEqual(polyline.decode('_izlhA~rlgdF_{geC~ywl@_kwzCn`{nI', 6), example);
        });
    });

    describe("#identity", function() {
      it('feed encode into decode and check if the result is the same as the input', function() {
        assert.deepEqual(polyline.decode(polyline.encode(example_slashes)), example_slashes);
      });

      it('feed decode into encode and check if the result is the same as the input', function() {
        assert.equal(polyline.encode(polyline.decode("_chxEn`zvN\\\\]]")), "_chxEn`zvN\\\\]]");
      });
    });

    describe('#encode()', function() {
        it('encodes an empty Array', function() {
            assert.equal(polyline.encode([]), '');
        });

        it('encodes an Array of lat/lon pairs into a String', function() {
            assert.equal(polyline.encode(example), '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
        });

        it('encodes with a custom precision', function() {
            assert.equal(polyline.encode(example, 6), '_izlhA~rlgdF_{geC~ywl@_kwzCn`{nI');
        });
    });

    describe('#fromGeoJSON()', function() {
        it('throws for non linestrings', function() {
            assert.throws(function() {
                polyline.fromGeoJSON({});
            }, /Input must be a GeoJSON LineString/);
        });

        it('allows geojson geometries', function() {
            assert.equal(polyline.fromGeoJSON(geojson.geometry), '_p~iF~ps|U_ulLnnqC_mqNvxq`@')
        })

        it('flips coordinates and encodes', function() {
            assert.equal(polyline.fromGeoJSON(geojson), '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
        });
    });

});
