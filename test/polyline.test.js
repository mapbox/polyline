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

    describe('#encodeCoordinate()', function() {
        it('should encode one of the google reference coords', function() {
            assert.equal(polyline.encodeCoordinate(-179.9832104), '`~oia@');
        });
    });

    describe('#encodePoint()', function() {
        it('should encode one of the google reference points', function() {
            assert.equal(polyline.encodePoint(38.5, -120.2), '_p~iF~ps|U');
        });
    });

    describe('#decodeLine()', function() {
        it('should decode a google reference line', function() {
            var coords = polyline.decodeLine('_p~iF~ps|U_ulLnnqC_mqNvxq`@');
            var against = [
                [38.5, -120.2],
                [40.7, -120.95],
                [43.252, -126.453]
            ];
            compare(coords, against);
        });
    });

    describe('#encodeLine()', function() {
        it('should encode two points', function() {
            assert.equal(polyline.encodeLine([[38.5, -120.2], [40.7, -120.95]]), '_p~iF~ps|U_ulLnnqC');
        });
    });

    describe('back and forth', function() {
        it('should encode two points', function() {
            assert.equal(polyline.encodeLine([[38.5, -120.2], [40.7, -120.95]]), '_p~iF~ps|U_ulLnnqC');
            compare(polyline.decodeLine('_p~iF~ps|U_ulLnnqC'), [[38.5, -120.2], [40.7, -120.95]]);
        });
    });

});
