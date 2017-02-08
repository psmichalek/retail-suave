'use strict'

const PKG_DIR     = __dirname.replace('/client','/');
const PKG         = require(PKG_DIR+'/package.json');
const APP_VERSION = (PKG!==null) ? parseInt(PKG.version) : 1;
const HOST_PORT = 8082
const connect = require('connect');
const serveStatic = require('serve-static');
const open = require('open');


connect().use(serveStatic(__dirname+'/dist/v'+APP_VERSION)).listen(HOST_PORT,function(){
    console.log('Dev server running on localhost:'+HOST_PORT);
    open('http://localhost:'+HOST_PORT);
});
