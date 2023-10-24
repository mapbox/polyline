# Changelog

## 1.2.1 (2023-09-14)
* Update dev dependencies. [#86](https://github.com/mapbox/polyline/pull/86)

## 1.2.0 (2023-04-06)
* Allow encoding with higher precision. [#82](https://github.com/mapbox/polyline/pull/82)

## 1.1.1 (2020-05-18)
* Fix `npm audit` warnings from a dependency.
* Fix reversing of coordinates when there are more than 2

## 1.1.0 (2019-05-06)

* Added `--precision` command line option.
* Fix to precision to support a value of `0`.

## 1.0.0 (2018-04-01)

* Added `--toGeoJSON` command line option.

## 0.2.0 (2016-07-19)

* Fix issue with negative rounding.
* Add `.toGeoJSON` method to convert an encoded polyline to GeoJSON
  LineString.

## 0.1.0 (2015-06-21)

* Add `.fromGeoJSON` method to encode GeoJSON geometries as polylines
  without needing to manually flip coordinates.
