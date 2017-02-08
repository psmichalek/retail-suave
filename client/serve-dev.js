'use strict'

const HOST_PORT = 8080
const connect = require('connect');
const serveStatic = require('serve-static');

connect().use(serveStatic(__dirname+'/src')).listen(HOST_PORT,function(){
    console.log('Dev server running on localhost:'+HOST_PORT);
});
