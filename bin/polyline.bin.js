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
      toGeoJson: {
        type: 'boolean',
        alias: 'toGeoJSON'
      },
      encode: {
        type: 'boolean',
        alias: 'e'
      },
      fromGeoJson: {
        type: 'boolean',
        alias: 'fromGeoJSON'
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
  toGeoJson,
  encode,
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
  process.stdout.write(`${JSON.stringify(converted)}\n`);
});

function convert(rawString) {
  if (encode) {
    return polyline.encode(JSON.parse(rawString), p);
  }

  if (fromGeoJson) {
    return polyline.fromGeoJSON(JSON.parse(rawString), p);
  }

  // Accept both raw polyline files and the JSON strings emitted by this CLI.
  const trimmed = rawString.trim();
  const encoded = trimmed[0] === '"' ? JSON.parse(trimmed) : trimmed;

  if (toGeoJson) {
    return polyline.toGeoJSON(encoded, p);
  }

  return polyline.decode(encoded, p);
}
