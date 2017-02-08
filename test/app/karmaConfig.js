'use strict'

const PKG = __dirname.replace('/test/app','/');
const APP = PKG + 'client/src';

var files = [];
require(PKG+'client/vendorSetup.js').jsScripts.map(function(v){ files.push(v.replace('/src',APP)) });
files.push(
    PKG+'client/src/vendor/angular-mocks/angular-mocks.js',
    PKG+"client/src/app.js",
    {pattern:PKG+'client/src/catalog/*.js',included:true},
    {pattern:PKG+'client/src/shared/*.js',included:true},
    {pattern:PKG+'test/app/*.test.js',included:true}
);

var ppkey = APP+'/**/*.js';

module.exports = function(config){
  config.set({
    plugins:['karma-mocha','karma-coverage','karma-chai','karma-sinon','karma-phantomjs-launcher'],
    basePath: '',
    frameworks: ['mocha','chai','sinon'],
    files: files,
    exclude: [],
    preprocessors: { ppkey : ['coverage']  },
    coverageReporter: {
        type:'html',
        dir:'coverage/',
        subdir:'html'
    },
    reporters: ['progress','coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  })
}
