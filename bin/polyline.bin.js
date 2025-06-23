#!/usr/bin/env node
const { parseArgs } = require('node:util');
const polyline = require('../');

let {
  values: {
    decode,
    encode,
    toGeoJSON,
    fromGeoJSON,
    toGeoJson,
    fromGeoJson,
    precision,
  },
} = parseArgs({
  options: {
    decode: { type: 'boolean', short: 'd', default: true },
    encode: { type: 'boolean', short: 'e' },
    toGeoJSON: { type: 'boolean' },
    fromGeoJSON: { type: 'boolean' },
    precision: { type: 'string', short: 'p' },
  },
  strict: false,
});

toGeoJSON = toGeoJSON || toGeoJson;
fromGeoJSON = fromGeoJSON || fromGeoJson;
decode = encode ? false : decode;

const p = precision ? parseInt(precision, 10) : undefined;

let rawInput = '';
process.stdin.on('readable', function () {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    rawInput += chunk;
  }
});

process.stdin.on('end', function () {
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

  if (decode) {
    return polyline.decode(rawString, p);
  }

  process.stderr.write('No valid option provided.\n');
  showHelp();
}

function showHelp() {
  console.log(`
  Provide data from stdin and use with --decode (default), --encode, --toGeoJSON, or --fromGeoJSON. Optionally provide precision.
  
  Usage:
  $ cat file.json | polyline --fromGeoJSON > file.geojson
  
  Options:
  --decode, -d         Return an array of lat/lon pairs (default)
  --toGeoJSON          Convert encoded string to GeoJSON
  --encode, -e         Return a string-encoded polyline
  --fromGeoJSON        Convert GeoJSON to string-encoded polyline
  --precision, -p      Set a precision (default is 5)
  `);
}

function exit() {
  showHelp();
  process.exit();
}
