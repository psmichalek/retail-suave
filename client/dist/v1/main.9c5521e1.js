
(function(angular){

    angular.module('app',['ngRoute','ngAnimate','mgcrea.ngStrap','appViews'])

})(window.angular);


(function(angular){

angular.module('app')
.controller('itemController',
  ['$scope','$timeout','$modal','Item','Messages','Logger','Urls',
  function($scope,$timeout,$modal,Item,Messages,Logger,Urls) {

    _initView();
    _load();

    /**********************
     * Private Methods
     **********************/

    function _initView(){

        $scope.viewingItemId    = 1;
        $scope.alert            = {active:false, mesg:'', timeout:5000};
      	$scope.item             = {};
        $scope.viewLoading      = true;
        $scope.thumbs           = [0,1,2];
        $scope.showThumb        = false;
        $scope.buyQuantity      = 1;

    }

    function _load() {
        Item.get($scope);
    }

   /**********************
    * Public Functions
    **********************/
    $scope.reload = function(){
        _load();
    }
    $scope.addQty = function(){
        $scope.buyQuantity = $scope.buyQuantity + 1;
    }
    $scope.subQty = function(){
        $scope.buyQuantity = $scope.buyQuantity - 1;
        if($scope.buyQuantity<0) $scope.buyQuantity = 0;
    }
    $scope.toggleMainImage = function(){
        $scope.showImage = false;
        $scope.item.images.forEach(function(v,i){
            if(v.isActive) $scope.item.images[i].isActive = false;
        })
        $scope.item.images[$scope.thumbs[1]].isActive = true;
        $timeout(function(){$scope.showImage=true;},200);
    }
    $scope.nextImage = function(){
        $scope.showThumb = false;
        $scope.thumbs.forEach(function(v,i){
            if( v+1 <= $scope.item.images.length-1 ){
                $scope.thumbs[i] = v+1;
            } else $scope.thumbs[i] = 0;
            $timeout(function(){$scope.showThumb=true;},200);
        });
    }
    $scope.prevImage = function(){
        $scope.showThumb = false;
        $scope.thumbs.forEach(function(v,i){
            if( v-1 >= 0 ){
                $scope.thumbs[i] = v-1;
            } else $scope.thumbs[i] = $scope.item.images.length-1;
            $timeout(function(){$scope.showThumb=true;},200);
        });
    }
    $scope.showStars = function() {
        var input = [];
        for (var i=1; i<=5; i=i+1) input.push(i);
        return input;
    }

}]);

})(window.angular);


(function(angular){

  angular.module('app')
  .factory('Item', ['$http','$sce','Urls','Messages','Logger',
    function ($http,$sce,Urls,Messages,Logger) {

  		var service={},caller='projects';

        function _fetchItem(scope) {

            function _success(resp){
              Logger.out('get successful ',resp,caller);
              if(resp.status==200 && typeof resp.data.CatalogEntryView!=='undefined') {

                  scope.item = resp.data.CatalogEntryView[0];

                  // Set item
                  // In real life abstract this out to apply business logic to get price to display
                  scope.item.price = scope.item.Offers[0].OfferPrice[0].formattedPriceValue;
                  scope.item.priceDesc = scope.item.Offers[0].OfferPrice[0].priceQualifier;

                  // Put image data into one images array to display all the images
                  scope.item.images = [];
                  scope.item.Images[0].PrimaryImage.forEach(function(prime){
                      if(prime.image) scope.item.images.push({isPrimary:true,isActive:true,image:prime.image});
                  });

                  scope.item.Images[0].AlternateImages.forEach(function(alt){
                      if(alt.image) scope.item.images.push({isPrimary:false,isActive:false,image:alt.image});
                  });

                 // Calculate review rating ave
                 scope.reviews = scope.item.CustomerReview[0].Reviews;
                 var lastRating = 0, totalRatingScore = 0;
                 scope.reviews.forEach(function(v,i){
                    totalRatingScore = v.overallRating + lastRating;
                    lastRating = v.overallRating;
                 });
                 scope.aveRatings = parseInt(totalRatingScore / scope.reviews.length);

                 // Set reviews
                 scope.proReview = scope.item.CustomerReview[0].Pro[0];
                 scope.proReview.datePosted = moment(scope.proReview.datePosted).format('MMM D, YYYY');
                 scope.conReview = scope.item.CustomerReview[0].Con[0];
                 scope.conReview.datePosted = moment(scope.conReview.datePosted).format('MMM D, YYYY');

                 //Set promos
                 scope.promos = [];
                 scope.item.Promotions.forEach(function(v,i){
                     scope.promos.push(v.Description[0].shortDescription);
                 })

                //Set add to button flags
                scope.showCartButton = (scope.item.purchasingChannelCode==1 || scope.item.purchasingChannelCode==0) ? true : false;
                scope.showPickupButton = (scope.item.purchasingChannelCode==2) ? true : false;

                //Set highlights
                scope.highlights = [];
                scope.item.ItemDescription[0].features.forEach(function(v,i){
                    scope.highlights.push($sce.trustAsHtml(v));
                });

                 // Switch flags to show images
                 scope.showThumb = true;
                 scope.showImage= true;

                 console.log('item ',scope.item)
              } else _failure(resp);
              scope.viewLoading=false;
            }

            function _failure(resp){
                Logger.out('get failed ',resp,caller);
                scope.viewLoading=false;
                scope.alert.active=true;
                scope.alert.mesg=Messages.generalError + Messages.getItemsFailed;
                scope.alert.type='error';
            }

            $http.get( Urls.getItem + scope.viewingItemId ).then( _success, _failure );
        }

        /**************************
         * Public Methods
         *************************/

        service.get = _fetchItem;

        return service;
  }]);

})(window.angular);

(function(angular){

angular.module('app')
.factory('errorService',function ($sce) {

	var service={}

	service.showAlert = function(alert,mesg){
		if( angular.isDefined(alert) ) {
			alert.active = true;
			alert.class = 'alert-danger'
			if(angular.isDefined(mesg)) alert.mesg = $sce.trustAsHtml(mesg);
		}
	}

	return service;
});

})(window.angular);

(function(angular){

angular.module('app')
.factory('Logger',['$log',
function($log){

	var service 	= {};
	service.debugOn = true;

	service.out = function(txt,val,caller){

		var caller 	= (angular.isDefined(caller)) ? caller : 'all';
		var txt 	= (angular.isDefined(txt)) ? txt : '';
		var val 	= (angular.isDefined(val)) ? val : '';

		if( service.debugOn ) $log.debug(txt,val);

	}

    service.logRemote = function(txt,val,caller){
        // call to remote logging service
    }

	return service;

}]);

})(window.angular);


(function(angular){

angular.module('app')
.factory('Messages',['$sce',function($sce){

	var messages = {};
    messages.generalError = 'There has been a system error. ';
    messages.getItemsFailed = 'The items you were looking for are not available, please try again later.';
    return messages;

}]);

})(window.angular);

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
