var assert = require('assert'),
    polyline = require('../');

describe('polyline', function() {
    var example = [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]];

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
});
