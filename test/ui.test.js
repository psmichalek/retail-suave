'use strict'

const expect = require('chai').expect;
const jsdom = require('jsdom');
const fs = require('fs');

describe('index.html ', () => {

     it('should have title that says Retail Suave', (done) => {
        const index = fs.readFileSync('./client/src/index.html', "utf-8");
        jsdom.env(index, function(err, window) {
            const h1 = window.document.getElementsByTagName('title')[0];
            expect(h1.innerHTML).to.equal("Retail Suave");
            done();
            window.close();
        });
    });

});
