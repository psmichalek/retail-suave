'use strict'

const request = require('supertest')
const exp = require('chai').expect

describe('Loading the Express server ', () => {

    var server

    beforeEach( () => {
        delete require.cache[require.resolve('../api/app.js')]
        server = require('../api/app.js').server
    })

    afterEach( (done) => {
        server.close(done)
    })

    it('should respond with status 404 to / ', (done) => {
        request(server)
        .get('/')
        .expect(404,done)
    })

    it('should respond with status 200 of content-type json to /api/item/:id ', (done) => {
        request(server)
        .get('/api/item/1')
        .set('Accept','application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

})
