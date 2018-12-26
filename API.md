### polyline.decode(string[, precision])

Takes a string representation of 1+ coordinate pairs
and returns an array of lat, lon arrays. If not specified,
precision defaults to 5.

### polyline.encode(array[, precision])

Takes an array of lat, lon arrays and returns an encoded
string. If not specified, precision defaults to 5.

### polyline.fromGeoJSON(geojson[, precision])

Takes a GeoJSON Point, LineString, or Polygon feature and returns an encoded string. If not specified, precision defaults to 5.

### polyline.toGeoJSON(string[, precision])

Takes an encoded string and returns a GeoJSON Point or LineString geometry. If not specified, precision defaults to 5.
