# [Mapbox](https://www.mapbox.com/)

### Get token to access Mapbox APIs (if you have an API token skip this)
#### Step 1: Login/Signup
* Create an accont to access [Mapbox Account Dashboard](https://account.mapbox.com/)
* Go to signup/login link https://account.mapbox.com/auth/signin/

#### Step 2: Creating a token
* You will be presented with a default token.
* If you want you can create an application specific token.


To get the route polyline make a GET request on 'https://api.mapbox.com/directions/v5/mapbox/driving/'source_longitude+','+source_latitude+';'+destination_longitude+','+destination_latitude+'?geometries=polyline&access_token='+token+'&overview=full'

Example of GET request : https://api.mapbox.com/directions/v5/mapbox/driving/-96.7970,32.7767;-74.0060,40.7128?geometries=polyline&access_token=jk.evgggiejdjks2ZWxjbWFwdXAiLCJhIjoiY2tQ&overview=full

### Note:
* We will be sending `geometries` as `polyline` and `overview` as `full`.
* Setting overview as full sends us complete route. Default value for `overview` is `simplified`, which is an approximate (smoothed) path of the resulting directions.
* Mapbox accepts source and destination, as semicolon seperated
  `{longitude},{latitud}`.

### URL CONFIGURATION
```php

//using mapbox API

//Source and Destination Coordinates..
$source_longitude='-96.79448';
$source_latitude='32.78165';
$destination_longitude='-96.818';
$destination_latitude='32.95399';
$key = 'mapbox.token';

$url='https://api.mapbox.com/directions/v5/mapbox/driving/'.$source_longitude.','.$source_latitude.';'.$destination_longitude.','.$destination_latitude.'?geometries=polyline&access_token='.$key.'&overview=full';

```

### POLYLINE EXTRACTION
```php

//extracting polyline from the JSON response..
$data_mapbox = json_decode($response, true);

//polyline..
$polyline_mapbox = $data_mapbox['routes']['0']['geometry'];

```

Note:

We extracted the polyline for a route from Mapbox API