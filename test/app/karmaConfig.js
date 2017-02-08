'use strict'

const PKG_DIR = __dirname.replace('/test/app','/');
const APP_DIR = PKG_DIR + 'client/src';

var files = [];
require(PKG_DIR+'client/vendorSetup.js').jsScripts.map(function(v){ files.push(v.replace('/src',APP_DIR)) });
files.push(
    PKG_DIR+'client/src/vendor/angular-mocks/angular-mocks.js',
    PKG_DIR+"client/src/app.js",
    {pattern:PKG_DIR+'client/src/catalog/*.js',included:true},
    {pattern:PKG_DIR+'client/src/shared/*.js',included:true},
    {pattern:PKG_DIR+'test/app/*.test.js',included:true}
);

var ppkey = APP_DIR+'/**/*.js';

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
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  })
}
