var assert = require('assert'),
    polyline = require('../'),
    package = require('../package.json');

describe('polyline', function() {
    var example = [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]],
        // encoded value will enclude slashes -> tests escaping
        example_slashes = [[35.6,-82.55], [35.59985, -82.55015], [35.6,-82.55]],
        example_flipped = [[-120.2, 38.5], [-120.95, 40.7], [-126.453, 43.252]],
        dependencies = { "turf-flip": "*", "geojson-coords": "*" }
        geojson = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [20.566406, 43.421008]
            }
        },
        flipped_coords = [43.421008, 20.566406];

    describe('#dependencies', function() {
        it('loads turf-flip as a dependency', function() {
            assert(package.dependencies['turf-flip']);
        });

        it ('loads geojson-coords as a dependency', function() {
            assert(package.dependencies['geojson-coords']);
        })
    });

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

    describe('#flip()', function() {
        it('returns coordinates from geojson', function() {
            assert.equal(typeof(polyline.flip(geojson)), 'object');
        });

        it ('flips geometry', function() {
            assert.deepEqual(polyline.flip(geojson), [flipped_coords]);
        })
    });
});
