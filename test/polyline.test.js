var assert = require('assert'),
    polyline = require('../');

describe('polyline', function() {
    function compare(coords, against) {
        function a(x) { return Math.round(x * 100) / 100; }
        coords.forEach(function(c, i) {
            assert.equal(a(c[0]), a(against[i][0]));
            assert.equal(a(c[1]), a(against[i][1]));
        });
    }

    describe('#decode()', function() {
        it('decodes an empty Array', function() {
            assert.deepEqual(polyline.decode(''), []);
        });

        it('decodes a String into an Array of lat/lon pairs', function() {
            var coords = polyline.decode('_p~iF~ps|U_ulLnnqC_mqNvxq`@');
            var against = [
                [38.5, -120.2],
                [40.7, -120.95],
                [43.252, -126.453]
            ];
            compare(coords, against);
        });
    });

    describe('#encode()', function() {
        it('encodes an empty Array', function() {
            assert.equal(polyline.encode([]), '');
        });

        it('encodes an Array of lat/lon pairs into a String', function() {
            assert.equal(polyline.encode([[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]), '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
        });
    });
});
