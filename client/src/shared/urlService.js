(function(angular){

angular.module('app')
.factory('Urls',['$sce',function($sce){

    var apibase = 'http://localhost:3001/api/';
	var urls = {};
    urls.getItem = apibase + 'item/';
    urls.imageModal = '/catalog/mo_image.html';
    return urls;

}]);

})(window.angular);
