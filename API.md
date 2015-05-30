### polyline.decode(string[, precision])

Takes a string representation of 1+ coordinate pairs
and returns an array of lat, lon arrays. If not specified,
precision defaults to 5.

### polyline.encode(array[, precision])

Takes an array of lat, lon arrays and returns an encoded
string. If not specified, precision defaults to 5.

### polyline.flip(geojson)

Takes a GeoJSON FeatureCollection, Feature, or Geometry
and returns its coordinates as a lat/lon array.
