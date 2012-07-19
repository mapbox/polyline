var assert = require('assert'),
    polyline = require('../');

describe('polyline', function() {
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

  describe('#encodeLine()', function() {
    it('should encode two points', function() {
      assert.equal(polyline.encodeLine([[38.5, -120.2], [40.7, -120.95]]), '_p~iF~ps|U_ulLnnqC');
    });
  });
});
