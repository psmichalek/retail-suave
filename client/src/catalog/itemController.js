
angular.module('app')
.controller('itemController',
  ['$scope','$routeParams','Item','Messages','Logger','Urls',
  function($scope,$routeParams,Item,Messages,Logger,Urls) {

    _initView();
    _load();

    /**********************
     * Private Methods
     **********************/

    function _initView(){
        $scope.alert            = {active:false, mesg:'', timeout:5000};
      	$scope.items            = [];
        $scope.viewLoading      = true;
        $scope.nextItemToView   = ( angular.isDefined($routeParams) ) ? $routeParams.itemId : 1;
    }

    function _load() {
        Item.get($scope);
    }

   /**********************
    * Toggles
    **********************/

    /**********************
     * Ises
     **********************/

    /**********************
     * Item actions
     **********************/


}]);
