#!/usr/bin/env node

const polyline = require('../');

const HELP = 'Provide data from stdin and use with --decode (default), --encode, --toGeoJSON, or --fromGeoJSON. Optionally provide a precision with --precision=6\n';

let precision = 5;
let rawInput = '';
const mode = process.argv[2] || '--decode';

if (process.argv[3]) {
  if (process.argv[3].startsWith('-p=')) {
    precision = parseInt(process.argv[3].split('-p=').pop(), 10);
  }
  if (process.argv[3].startsWith('--precision=')) {
    precision = parseInt(process.argv[3].split('--precision=').pop(), 10);
  }
}

if (mode === '--help' || mode === '-h') {
  exit();
}

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    rawInput += chunk;
  }
});

process.stdin.on('end', function() {
  const converted = convert(rawInput, mode);
  if (!converted) {
    exit();
  }
  process.stdout.write(JSON.stringify(converted));
});

function convert(rawString, mode) {
  switch(mode) {
    case '--decode' :
      return polyline.decode(rawString, precision);
    case '--encode' :
      return polyline.encode(rawString, precision);
    case '--toGeoJSON':
      return polyline.toGeoJSON(rawString, precision);
    case '--fromGeoJSON' :
      return polyline.fromGeoJSON(JSON.parse(rawString), precision);
  }
}

function exit() {
  process.stdout.write(HELP);
  process.exit();
}
