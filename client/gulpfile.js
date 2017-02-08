'use strict'

const PKG_DIR     = __dirname.replace('/client','/');
const PKG         = require(PKG_DIR+'/package.json');
const APP_VERSION = (PKG!==null) ? parseInt(PKG.version) : 1;
const jslibs      = require('./vendorSetup.js').jsScripts;
const csslibs     = require('./vendorSetup.js').cssScripts;
const del         = require('del')
const runSequence = require('run-sequence')
const moment      = require('moment')
const gulp        = require('gulp')
const addstr      = require('gulp-inject-string')
const concat      = require('gulp-concat')
const clean       = require('gulp-clean')
const uglify      = require('gulp-uglify')
const rename      = require('gulp-rename')
const debug       = require('gulp-debug')
const tmplize     = require("gulp-ng-html2js")
const inject 	    = require('gulp-inject')
const CacheBuster = require('gulp-cachebust')
const cleanCss    = require('gulp-clean-css')
const sass        = require('gulp-sass')
const cachebust   = new CacheBuster()
const htmlreplace = require('gulp-html-replace')
const series      = require('stream-series')
const htmlmin     = require('gulp-htmlmin')

/***********************
 *  Watcher Tasks
 **********************/

    gulp.task('watch-build',function(){
      gulp.watch('./src/**/*.js', ['build']);
    })

    gulp.task('watch-js',function(){
      gulp.watch('./src/**/*.js', ['index','test']);
    })

    gulp.task('watch-sass',function(){
      gulp.watch(['./src/**/*.scss','!./src/vendor/**/*'], ['sass']);
    })

/***********************
 *  Build Tasks
 **********************/

    gulp.task('build',function(){
        runSequence('build:clean','build:main');
    });

    gulp.task('build:clean', function() {
        return del(['./dist/v'+APP_VERSION+'/*']);
    });

    gulp.task('build:main',function(){

        const faFonts = gulp.src('./src/vendor/font-awesome/fonts/*.*')
        .pipe( gulp.dest( './dist/v'+APP_VERSION+'/fonts' ) )
		.pipe( debug() )
		.on('error',errorHandler)

        const cssMain = gulp.src(['./src/**/*.css','!./src/vendor/**/*'])
        .pipe( concat('main.min.css') )
        .pipe( cleanCss() )
        .pipe( cachebust.resources() )
        .pipe( gulp.dest('./dist/v'+APP_VERSION+'/') )
        .pipe( sass().on('error', sass.logError) )
        .pipe( debug() )

        const cssLib = gulp.src( csslibs.map(function(path){return '.'+path}) )
        .pipe( concat('vendor.min.css') )
        .pipe( addstr.replace('../fonts', 'fonts') )
        .pipe( cleanCss() )
		.pipe( cachebust.resources() )
		.pipe( gulp.dest( './dist/v'+APP_VERSION+'/' ) )
		.pipe( debug() )
		.on('error',errorHandler)

        const jsLib = gulp.src( jslibs.map(function(path){return '.'+path}) )
        .pipe( concat('vendor.min.js') )
        .pipe( uglify() )
		.pipe( cachebust.resources() )
		.pipe( gulp.dest( './dist/v'+APP_VERSION+'/' ) )
		.pipe( debug() )
		.on('error',errorHandler)

        const jsMain = gulp.src(['./src/**/*.js','!./src/vendor/**/*'])
        .pipe( concat('main.js') )
        .pipe( addstr.after('\'mgcrea.ngStrap\'', ',\'appViews\'') )
        //.pipe( uglify() )
		.pipe( cachebust.resources() )
		.pipe( gulp.dest( './dist/v'+APP_VERSION+'/' ) )
		.pipe( debug() )
		.on('error',errorHandler)

        const jsViews = gulp.src(['!./src/vendor/**/*','./src/catalog/*.html'])
        .pipe( tmplize( { moduleName: 'appViews', prefix:"/catalog/" } ) )
        .pipe( concat( 'views.min.js' ) )
        .pipe( uglify() )
        .pipe( cachebust.resources() )
        .pipe( gulp.dest( './dist/v'+APP_VERSION+'/' ) )
        .pipe( debug() )
        .on('error',errorHandler)

        const injecttext = '\n<!-- Build Generated On: '+moment().format("MM/DD/YYYY hh:mm:ss A")+' --> \n'

      return gulp.src('./src/index.html')
      .pipe( inject(series(cssMain,jsViews,jsMain),{name:'app',ignorePath:'/src'}) )
      .pipe( inject(series(cssLib,jsLib),{name:'vendor',ignorePath:'/src'}) )
      .pipe( addstr.after('</title>', injecttext) )
      //.pipe( htmlmin({collapseWhitespace:true}) )
      .pipe( cachebust.references() )
      .pipe( addstr.replace('/dist/v'+APP_VERSION+'/', ''))
      .pipe( gulp.dest('./dist/v'+APP_VERSION+'/') );


    })
    /***********************
     *  Actor Tasks
     **********************/

    // Rebuild index file
    gulp.task('index', function () {

        const vendorFiles = [];
        jslibs.forEach(function(v){ vendorFiles.push(v.replace('/src/','./src/')) });
        csslibs.forEach(function(v,i){ if(i!=csslibs.length-1) vendorFiles.push(v.replace('/src/','./src/')) });

        const vendorSource = gulp.src(vendorFiles, {read: false});
        const appSource = gulp.src(['!./src/vendor/**/*','./src/**/*.js','./src/**/*.css'],{read:false});

        return gulp.src('./src/index.html')
        .pipe( inject( vendorSource, {name:'vendor',ignorePath:'/src'}) )
        .pipe( inject( appSource, {name:'app',ignorePath:'/src'}) )
        .pipe( gulp.dest('./src/') )
        .pipe( debug() )
        .on('error',errorHandler);

    });

    // Compile SASS
    gulp.task('sass',function(){
     return gulp.src(['!./src/vendor/**/*','./src/**/*.scss'])
         .pipe(concat('app.css'))
         .pipe(sass().on('error', sass.logError))
         .pipe(debug())
         .pipe(gulp.dest('./src/'));
    });

/***********************
 *  Testing Tasks
 **********************/

    // Run Karma unit tests once
    gulp.task('test',function(callback){
      const opts={
        configFile: __dirname + '/test/unit/karmaConfig.js',
        singleRun: true
      }
      const ks = new karma.Server(opts,callback);
      ks.start();
    });

    // Run Karma unit tests ongoing (watcher mode)
    gulp.task('tdd',function(callback){
      const opts={ configFile: __dirname + '/test/unit/karmaConfig.js' }
      const ks = new karma.Server(opts,callback);
      ks.start();
    });


function errorHandler (error) { console.log(error.toString()); this.emit('end'); }
