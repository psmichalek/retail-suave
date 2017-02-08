
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
