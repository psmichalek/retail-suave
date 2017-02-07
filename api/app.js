'use strict'
const HOST_PORT     = 3001;
const express       = require('express');
const bodyParser    = require('body-parser');
const app = express();

var server = app.listen(HOST_PORT, () => {
    console.log('listening on '+HOST_PORT) ;
})

app.use(function(req, resp, next) {
   resp.header("Access-Control-Allow-Origin", "*");
   resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.get('/api/item/:id', (req,res) => {
    res.sendFile(__dirname+'/item-data.json');
});

module.exports = { 'server':server }
