(function(angular){

angular.module('app')
.config(function ($routeProvider) {
    $routeProvider
     .when('/catalog', {
          templateUrl: '/catalog/vw_main.html',
          controller: 'itemController'
        })
    .otherwise({
      redirectTo: '/catalog'
    })
});

})(window.angular);
