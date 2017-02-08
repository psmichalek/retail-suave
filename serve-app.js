'use strict'

const exec = require('child_process').exec;

// Start the api server
var api = exec('node api/app.js');

api.stdout.on('data', function(data) {
    console.log('api server stdout: ' + data);
});
api.stderr.on('data', function(data) {
    console.log('api server stdout: ' + data);
});
api.on('api server close', function(code) {
    console.log('closing code: ' + code);
});

// Start the dev server
var dev = exec('node client/serve-src.js');

dev.stdout.on('data', function(data) {
    console.log('dev server stdout: ' + data);
});
dev.stderr.on('data', function(data) {
    console.log('dev server stdout: ' + data);
});
dev.on('close', function(code) {
    console.log('dev server closing code: ' + code);
});
