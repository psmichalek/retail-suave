
  angular.module('app')
  .factory('Item', ['$http','$sce','Urls','Messages','Logger',
    function ($http,$sce,Urls,Messages,Logger) {

  		var service={},caller='projects';

        function _fetchItem(scope) {

            function _success(resp){
              Logger.out('get successful ',resp,caller);
              if(resp.status==200) {
                  scope.items = resp.data.CatalogEntryView;
                  scope.items.forEach(function(item){

                      // In real life abstract this out to apply business logic to get price to display
                      item.price = item.Offers[0].OfferPrice[0].formattedPriceValue;
                      item.priceDesc = item.Offers[0].OfferPrice[0].priceQualifier;

                      // Put image data into one images array to display all the images
                      item.images = [];
                      item.Images[0].PrimaryImage.forEach(function(img){
                          item.images.push({isPrimary:true,isActive:true,image:img.image});
                      });
                      item.Images[0].AlternateImages.forEach(function(img){
                          item.images.push({isPrimary:false,isActive:false,image:img.image});
                      });


                  })
              } else _failure(resp);
              scope.viewLoading=false;
            }

            function _failure(resp){
                Logger.out('get failed ',resp,caller);
                scope.viewLoading=false;
                scope.alert.active=true;
                scope.alert.mesg=Messages.generalError + Messages.getItemsFailed + $sce.trustAsHtml(resp.data);
                scope.alert.type='error';
            }

            $http.get( Urls.getItem.replace("{{id}}",scope.nextItemToView) ).then( _success, _failure );
        }

        /**************************
         * Public Methods
         *************************/

        service.get = _fetchItem;

        return service;
  }]);
