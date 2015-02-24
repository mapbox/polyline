### polyline.decode(string[, precision])

Takes a string representation of 1+ coordinate pairs
and returns an array of lat, lon arrays. If not specified,
precision defaults to 5.

### polyline.encode(array[, precision])

Takes an array of lat, lon arrays and returns an encoded
string. If not specified, precision defaults to 5.


### polyline.decodeToLatLng(string[, precision])

Takes a string representation of 1+ coordinate pairs 
and returns an array of LatLng object ([Google Maps Object](https://developers.google.com/maps/documentation/javascript/reference#LatLng])) . If not specified, 
precision defaults to 5.

### polyline.encodeFromLatLng(array[, precision])

Takes an array of  LatLng object ([Google Maps Object](https://developers.google.com/maps/documentation/javascript/reference#LatLng])) and returns an encoded
string. If not specified, precision defaults to 5.

