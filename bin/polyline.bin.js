#!/usr/bin/env node

var polyline = require('../');

var HELP = 'Provide data from stdin and use with --decode (default), --encode, or --fromGeoJSON\n';

var mode = process.argv[2] || '--decode';
var rawInput = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    rawInput += chunk;
  }
});

process.stdin.on('end', function() {
  if (mode === '--help' || mode === '-h') {
    exit();
  } else {
    var converted = convert(rawInput, mode);
    if (!converted) {
      exit();
    }
    process.stdout.write(JSON.stringify(converted));
  }
});

function convert(rawString, mode) {
  switch(mode) {
    case '--decode' :
      return polyline.decode(rawString);
    case '--encode' :
      return polyline.encode(rawString);
    case '--fromGeoJSON' :
      return polyline.fromGeoJSON(JSON.parse(rawString));
  }
}

function exit() {
  process.stdout.write(HELP);
  process.exit();
}
