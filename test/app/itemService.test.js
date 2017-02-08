
describe('Item Service Module >', function(){

    const getItemApiCall ='http://localhost:3001/api/item/';
    const requestResp = {config:{},status:200,headers:'',statusText:'OK',data:{}};

    beforeEach(module('app'));

    var $rootScope, $controller, $httpBackend, $timeout, $scope, controller, createController;

	var Item, Messages, Urls;

    beforeEach(inject(function (
		_$rootScope_,_$controller_,_$httpBackend_,
		_$timeout_,_Item_,_Messages_,_Logger_,
		_Urls_) {
		$rootScope 		= _$rootScope_;
		$controller 	= _$controller_;
		$httpBackend 	= _$httpBackend_;
		Messages		= _Messages_;
		Item			= _Item_;
		Urls			= _Urls_;
        Logger          = _Logger_;

		createController = function(cname,scope){ return $controller(cname,{$scope:scope}); }

	}));

    it('should have access to the Urls service ',function(){

        assert.isDefined(Urls,'Urls is defined');
        assert.isDefined(Urls.getItem ,'Urls.getItem is defined');
        assert.equal(Urls.getItem ,getItemApiCall,'Urls.getItem is true');

    });

    it('should have access to the Item service ',function(){

        assert.isDefined(Item,'Item is defined');
        assert.isDefined(Item.get,'Item.get is defined');

    });

    it('should have access to the Logger service ',function(){

        assert.isDefined(Logger,'Logger is defined');
        assert.isDefined(Logger.out,'Logger.out is defined');

    });

    it('should populate alert if there is an error fetching data ', function(){

        $scope = {};
		controller = createController('itemController',$scope);

        assert.isFalse($scope.alert.active);
        expect($scope.alert.mesg).to.equal('');

        $httpBackend.expectGET( Urls.getItem + 1 ).respond(500,requestResp);
        $httpBackend.flush();

        assert.isTrue($scope.alert.active);
        expect($scope.alert.mesg).to.contain('error')


    });

    // Need tests to verify the data contract

})
