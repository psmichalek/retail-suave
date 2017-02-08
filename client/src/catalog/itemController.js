
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
