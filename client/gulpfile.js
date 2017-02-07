'use strict'

const PKG = (process.env.APP_BASE) ? require(process.env.APP_BASE+'/package.json') : null;

const APP_VERSION = (PKG!==null) ? parseInt(PKG.version) : 1;

let jslibs = [
    "/src/vendor/jquery/dist/jquery.js",
    "/src/vendor/angular/angular.js",
    "/src/vendor/moment/moment.js",
    "/src/vendor/angular-strap/dist/angular-strap.js",
    "/src/vendor/angular-strap/dist/angular-strap.tpl.js",
    "/src/vendor/angular-animate/angular-animate.js",
    "/src/vendor/angular-route/angular-route.js"
];

let csslibs = [
    "./src/vendor/font-awesome/css/font-awesome.css",
    "./src/vendor/bootstrap/dist/css/bootstrap.css",
    "./src/vendor/bootstrap/dist/css/bootstrap-theme.css",
    "./src/**/*.scss"
];

let del         = require('del')
let runSequence = require('run-sequence')
let moment      = require('moment')
let gulp        = require('gulp')
let addstr      = require('gulp-inject-string')
let concat      = require('gulp-concat')
let clean       = require('gulp-clean')
let uglify      = require('gulp-uglify')
let rename      = require('gulp-rename')
let debug       = require('gulp-debug')
let tmplize     = require("gulp-ng-html2js")
let inject 	    = require('gulp-inject')
let CacheBuster = require('gulp-cachebust')
let cleanCss    = require('gulp-clean-css')
let sass        = require('gulp-sass')
let cachebust   = new CacheBuster()
let htmlreplace = require('gulp-html-replace')
let series      = require('stream-series')
let htmlmin     = require('gulp-htmlmin')

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

        let faFonts = gulp.src('./src/vendor/font-awesome/fonts/*.*')
        .pipe( gulp.dest( './dist/v'+APP_VERSION+'/fonts' ) )
		.pipe( debug() )
		.on('error',errorHandler)

        let cssMain = gulp.src(['./src/**/*.css','!./src/vendor/**/*'])
        .pipe( concat('main.min.css') )
        .pipe( cleanCss() )
        .pipe( cachebust.resources() )
        .pipe( gulp.dest('./dist/v'+APP_VERSION+'/') )
        .pipe( sass().on('error', sass.logError) )
        .pipe( debug() )

        let cssLib = gulp.src( csslibs )
        .pipe( concat('vendor.min.css') )
        .pipe(addstr.replace('../fonts', 'fonts'))
        .pipe( cleanCss() )
		.pipe( cachebust.resources() )
		.pipe( gulp.dest( './dist/v'+APP_VERSION+'/' ) )
		.pipe( debug() )
		.on('error',errorHandler)

        let jsLib = gulp.src( jslibs.map(function(path){return '.'+path}))
        .pipe( concat('vendor.min.js') )
        .pipe( uglify() )
		.pipe( cachebust.resources() )
		.pipe( gulp.dest( './dist/v'+APP_VERSION+'/' ) )
		.pipe( debug() )
		.on('error',errorHandler)

        let jsMain = gulp.src(['./src/**/*.js','!./src/vendor/**/*'])
        .pipe( concat('main.js') )
        //.pipe( uglify() )
		.pipe( cachebust.resources() )
		.pipe( gulp.dest( './dist/v'+APP_VERSION+'/' ) )
		.pipe( debug() )
		.on('error',errorHandler)

        let jsViews = gulp.src('./src/**/*.html')
        .pipe( tmplize( { moduleName: 'appViews', prefix:"views/" } ) )
        .pipe( concat( 'views.min.js' ) )
        .pipe( uglify() )
        .pipe( cachebust.resources() )
        .pipe( gulp.dest( './dist/v'+APP_VERSION+'/' ) )
        .pipe( debug() )
        .on('error',errorHandler)

        let injecttext = '\n<!-- Build Generated On: '+moment().format("MM/DD/YYYY hh:mm:ss A")+' --> \n'

      return gulp.src('./src/index.html')
      .pipe( inject(series(cssLib,cssMain,jsLib,jsViews,jsMain)) )
      .pipe( addstr.after('</title>', injecttext) )
      .pipe( htmlmin({collapseWhitespace:true}) )
      .pipe( cachebust.references() )
      .pipe(addstr.replace('/dist/v'+APP_VERSION+'/', ''))
      .pipe( gulp.dest('./dist/v'+APP_VERSION+'/') );


    })
    /***********************
     *  Actor Tasks
     **********************/

    // Rebuild index file
    gulp.task('index', function () {
        let vendorFiles = [];
        jslibs.forEach(function(v){ vendorFiles.push(v.replace('/src/','./src/')) })
        csslibs.forEach(function(v,i){ if(i!=csslibs.length-1) vendorFiles.push(v) })
        let target = gulp.src('./src/index.html');
        let opts = {};
        opts.ignorePath = '/src';
        let sources = gulp.src(['!./src/vendor/**/*','./src/**/*.js','./src/**/*.css'],{read:false});
        return target
        .pipe( inject(gulp.src(vendorFiles, {read: false}), {name:'vendor',ignorePath:'/src'}) )
        .pipe( inject(sources,opts) )
        .pipe( gulp.dest('./src/') )
        .pipe( debug() )
        .on('error',errorHandler)
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
      let opts={
        configFile: __dirname + '/test/unit/karmaConfig.js',
        singleRun: true
      }
      let ks = new karma.Server(opts,callback);
      ks.start();
    });

    // Run Karma unit tests ongoing (watcher mode)
    gulp.task('tdd',function(callback){
      let opts={ configFile: __dirname + '/test/unit/karmaConfig.js' }
      let ks = new karma.Server(opts,callback);
      ks.start();
    });


function errorHandler (error) { console.log(error.toString()); this.emit('end'); }
