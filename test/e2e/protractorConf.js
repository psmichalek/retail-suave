/**
 * Protractor configuration file
 *  Using Mocha, Chai with chai-as-promised
 *  Using Chrome browser
 */

exports.config = {
    framework:'mocha',
	chromeOnly: true,
	capabilities: { 'browserName':'chrome' },
	seleniumAddress: 'http://127.0.0.1:4444/wd/hub/',
	specs: ['./*.test.js'],
	mochaOpts: {
        reporter:'spec',
		slow: 25000,
		mode: 'Quiet'
	},
  	onPrepare: function(){

      browser.ignoreSynchronization = true;

  		// Init lodash
  		global._ = require('lodash');

      // Init chai for using chai assertions
      global.chai   = require('chai');
      global.cap    = require('chai-as-promised');
      chai.use(cap);
      global.expect = chai.expect;

    }
};
