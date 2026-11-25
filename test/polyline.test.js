'use strict';

var test = require('tap').test,
    polyline = require('../'),
    spawnSync = require('child_process').spawnSync,
    cli = require('path').join(__dirname, '../bin/polyline.bin.js');

function runCli(t, args, input) {
    var result = spawnSync(process.execPath, [cli].concat(args), {
        input: input,
        encoding: 'utf8',
        timeout: 5000
    });
    t.equal(result.status, 0, result.stderr || 'CLI exits successfully');
    return result.stdout;
}

test('polyline CLI', function(t) {
    var coordinates = [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]],
        encoded = '_p~iF~ps|U_ulLnnqC_mqNvxq`@',
        geometry = {
            type: 'LineString',
            coordinates: [[-120.2, 38.5], [-120.95, 40.7], [-126.453, 43.252]]
        };

    t.test('encodes JSON coordinates with default and custom precision', function(t) {
        t.equal(runCli(t, ['--encode'], JSON.stringify(coordinates)), JSON.stringify(encoded) + '\n');
        t.equal(runCli(t, ['-e', '-p', '0'], JSON.stringify(coordinates)), '"mAnFC@CH"\n');
        t.equal(runCli(t, ['-e', '-p', '6'], JSON.stringify(coordinates)), '"_izlhA~rlgdF_{geC~ywl@_kwzCn`{nI"\n');
        t.end();
    });

    t.test('decodes raw polylines with file line endings', function(t) {
        t.equal(runCli(t, [], encoded + '\n'), JSON.stringify(coordinates) + '\n');
        t.equal(runCli(t, ['--decode'], encoded + '\r\n'), JSON.stringify(coordinates) + '\n');
        t.equal(runCli(t, ['-d'], encoded), JSON.stringify(coordinates) + '\n');
        t.end();
    });

    t.test('feeds JSON encoded output back into both decoders', function(t) {
        var output = runCli(t, ['--encode'], JSON.stringify(coordinates));
        t.equal(runCli(t, ['--decode'], output), JSON.stringify(coordinates) + '\n');
        t.equal(runCli(t, ['--toGeoJSON'], output), JSON.stringify(geometry) + '\n');
        t.equal(runCli(t, ['--fromGeoJSON'], JSON.stringify(geometry)), output);
        t.end();
    });

    t.test('preserves escaped backslashes during a CLI round trip', function(t) {
        var points = [[35.6, -82.55], [35.59985, -82.55015], [35.6, -82.55]],
            output = runCli(t, ['--encode'], JSON.stringify(points));
        t.equal(runCli(t, [], output), JSON.stringify(points) + '\n');
        t.end();
    });

    t.test('accepts camel-case and kebab-case GeoJSON options', function(t) {
        ['--toGeoJSON', '--toGeoJson', '--to-geo-json'].forEach(function(flag) {
            t.equal(runCli(t, [flag], encoded), JSON.stringify(geometry) + '\n');
        });
        ['--fromGeoJSON', '--fromGeoJson', '--from-geo-json'].forEach(function(flag) {
            t.equal(runCli(t, [flag], JSON.stringify(geometry)), JSON.stringify(encoded) + '\n');
        });
        t.end();
    });

    t.test('accepts empty arrays and empty encoded strings', function(t) {
        t.equal(runCli(t, ['--encode'], '[]'), '""\n');
        t.equal(runCli(t, ['--fromGeoJSON'], '{"type":"LineString","coordinates":[]}'), '""\n');
        t.equal(runCli(t, [], '""\n'), '[]\n');
        t.equal(runCli(t, [], ''), '[]\n');
        t.end();
    });

    t.end();
});

test('polyline', function(t) {
    var example = [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]],
        exampleWithZ = [[38.5, -120.2, 0], [40.7, -120.95, 0], [43.252, -126.453, 0]],
        example_zero = [[39, -120], [41, -121], [43, -126]],
        // encoded value will enclude slashes -> tests escaping
        example_slashes = [[35.6, -82.55], [35.59985, -82.55015], [35.6, -82.55]],
        example_flipped = [[-120.2, 38.5], [-120.95, 40.7], [-126.453, 43.252]],
        example_rounding = [[0, 0.000006], [0, 0.000002]],
        example_rounding_negative = [[36.05322, -112.084004], [36.053573, -112.083914], [36.053845, -112.083965]],
        example_high_precision = [[179.1234567895121, -179.1245965456112]];

    var geojson = { 'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': example_flipped
        },
        'properties': {}
    };

    t.test('#decode()', function(t) {
        t.test('decodes an empty Array', function(t) {
            t.deepEqual(polyline.decode(''), []);
            t.end();
        });

        t.test('decodes a String into an Array of lat/lon pairs', function(t) {
            t.deepEqual(polyline.decode('_p~iF~ps|U_ulLnnqC_mqNvxq`@'), example);
            t.end();
        });

        t.test('decodes with a custom precision', function(t) {
            t.deepEqual(polyline.decode('_izlhA~rlgdF_{geC~ywl@_kwzCn`{nI', 6), example);
            t.end();
        });

        t.test('decodes with precision 0', function(t) {
            t.deepEqual(polyline.decode('mAnFC@CH', 0), example_zero);
            t.end();
        });

        t.end();
    });

    t.test('#identity', function(t) {
        t.test('feed encode into decode and check if the result is the same as the input', function(t) {
            t.deepEqual(polyline.decode(polyline.encode(example_slashes)), example_slashes);
            t.end();
        });

        t.test('feed encode into decode and check if the result is the same as the input with high precision', function(t) {
            var result = polyline.decode(polyline.encode(example_high_precision, 13), 13)
            t.deepEqual(result, example_high_precision);
            t.end();
        });

        t.test('feed decode into encode and check if the result is the same as the input', function(t) {
            t.equal(polyline.encode(polyline.decode('_chxEn`zvN\\\\]]')), '_chxEn`zvN\\\\]]');
            t.end();
        });

        t.end();
    });

    t.test('#encode()', function(t) {
        t.test('encodes an empty Array', function(t) {
            t.equal(polyline.encode([]), '');
            t.end();
        });

        t.test('encodes an Array of lat/lon pairs into a String', function(t) {
            t.equal(polyline.encode(example), '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
            t.end();
        });

        t.test('encodes an Array of lat/lon/z into the same string as lat/lon', function(t) {
            t.equal(polyline.encode(exampleWithZ), '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
            t.end();
        });

        t.test('encodes with proper rounding', function(t) {
            t.equal(polyline.encode(example_rounding), '?A?@');
            t.end();
        });

        t.test('encodes with proper negative rounding', function(t) {
            t.equal(polyline.encode(example_rounding_negative), 'ss`{E~kbkTeAQw@J');
            t.end();
        });

        t.test('encodes with a custom precision', function(t) {
            t.equal(polyline.encode(example, 6), '_izlhA~rlgdF_{geC~ywl@_kwzCn`{nI');
            t.end();
        });

        t.test('encodes with precision 0', function(t) {
            t.equal(polyline.encode(example, 0), 'mAnFC@CH');
            t.end();
        });

        t.test('encodes negative values correctly', function(t) {
            t.ok(polyline.decode(polyline.encode([[-107.3741825, 0]], 7), 7)[0][0] < 0);
            t.end();
        });


        t.end();
    });

    t.test('#fromGeoJSON()', function(t) {
        t.test('throws for non linestrings', function(t) {
            t.throws(function() {
                polyline.fromGeoJSON({});
            }, /Input must be a GeoJSON LineString/);
            t.end();
        });

        t.test('allows geojson geometries', function(t) {
            t.equal(polyline.fromGeoJSON(geojson.geometry), '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
            t.end();
        });

        t.test('flips coordinates and encodes', function(t) {
            t.equal(polyline.fromGeoJSON(geojson), '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
            t.end();
        });

        t.end();
    });

    t.test('#toGeoJSON()', function(t) {
        t.test('flips coordinates and decodes geometry', function(t) {
            t.deepEqual(polyline.toGeoJSON('_p~iF~ps|U_ulLnnqC_mqNvxq`@'), geojson.geometry);
            t.end();
        });

        t.end();
    });

    t.end();
});
