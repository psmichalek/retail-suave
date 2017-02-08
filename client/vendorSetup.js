'use strict'

const JS_VENDOR_SCRIPTS =
[
    "/src/vendor/jquery/dist/jquery.js",
    "/src/vendor/angular/angular.js",
    "/src/vendor/moment/moment.js",
    "/src/vendor/angular-strap/dist/angular-strap.js",
    "/src/vendor/angular-strap/dist/angular-strap.tpl.js",
    "/src/vendor/angular-animate/angular-animate.js",
    "/src/vendor/angular-route/angular-route.js"

];

const CSS_VENDOR_SCRIPTS =
[
    "/src/vendor/font-awesome/css/font-awesome.css",
    "/src/vendor/bootstrap/dist/css/bootstrap.css",
    "/src/vendor/bootstrap/dist/css/bootstrap-theme.css"
];

module.exports = {
    jsScripts : JS_VENDOR_SCRIPTS,
    cssScripts : CSS_VENDOR_SCRIPTS
}
