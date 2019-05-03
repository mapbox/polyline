#!/usr/bin/env node

const meow = require('meow');
const polyline = require('../');

const cli = meow(
  `
  Provide data from stdin and use with --decode (default), --encode, --toGeoJSON, or --fromGeoJSON. Optionally provide precision.

  Usage
    $ cat file.json | polyline --fromGeoJSON > file.geojson
  Options
    --decode -d return an array of lat, lon pairs
    --toGeoJSON return GeoJSON from string-encoded polyline
    --encode -e return a string-encoded polyline
    --fromGeoJSON return a string-encoded polyline from GeoJSON
    --precision, -p set a precision.
`,
  {
    flags: {
      decode: {
        type: 'boolean',
        alias: 'd'
      },
      toGeoJSON: {
        type: 'boolean'
      },
      encode: {
        type: 'boolean',
        alias: 'e'
      },
      fromGeoJSON: {
        type: 'boolean'
      },
      precision: {
        type: 'string',
        alias: 'p'
      }
    }
  }
);

const {
  precision,
  decode,
  toGeoJSON,
  toGeoJson,
  encode,
  fromGeoJSON,
  fromGeoJson
} = cli.flags;

let p;

if (precision) {
  p = parseInt(precision, 10);
}

let rawInput = '';
process.stdin.on('readable', function() {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    rawInput += chunk;
  }
});

process.stdin.on('end', function() {
  const converted = convert(rawInput);
  if (!converted) {
    exit();
  }
  process.stdout.write(`${JSON.stringify(converted)}\n`);
});

function convert(rawString) {
  if (encode) {
    return polyline.encode(rawString, p);
  }

  if (toGeoJSON || toGeoJson) {
    return polyline.toGeoJSON(rawString, p);
  }

  if (fromGeoJSON || fromGeoJson) {
    return polyline.fromGeoJSON(JSON.parse(rawString), p);
  }

  return polyline.decode(rawString, p);
}

function exit() {
  process.stdout.write(cli.showHelp());
  process.exit();
}
