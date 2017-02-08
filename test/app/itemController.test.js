
describe('Item Controller Module >', function(){

    const getItemApiCall ='http://localhost:3001/api/item/';
    const requestResp = {config:{},status:200,headers:'',statusText:'OK',data:{}};

    beforeEach(module('app'));

    var $rootScope, $controller, $httpBackend, $timeout, $scope, controller, createController;

	var Item, Messages, Urls;

    beforeEach(inject(function (
		_$rootScope_,_$controller_,_$httpBackend_,
		_$timeout_,_Item_,_Messages_,
		_Urls_) {
		$rootScope 		= _$rootScope_;
		$controller 	= _$controller_;
		$httpBackend 	= _$httpBackend_;
		$timeout 		= _$timeout_;
		Messages		= _Messages_;
		Item			= _Item_;
		Urls			= _Urls_;

		createController = function(cname,scope){ return $controller(cname,{$scope:scope}); }

	}));

    it('should define a controller and scope ',function(){
        $scope={};
		controller = createController('itemController',$scope);
        assert.isDefined(controller,'Controller is defined');
    });

    it('should have access to the Urls service ',function(){

        assert.isDefined(Urls,'Urls is defined');
        assert.isDefined(Urls.getItem ,'Urls.getItem is defined');
        assert.equal(Urls.getItem ,getItemApiCall,'Urls.getItem is true');

    });

    it('should have access to the Item service ',function(){

        assert.isDefined(Item,'Item is defined');
        assert.isDefined(Item.get,'Item.get is defined');

    });

    it('should initalize scope vars with defaults - ', function(){

        $scope={};
		controller = createController('itemController',$scope);

        assert.isObject($scope.alert,'$scope.alert is an object');
        assert.isObject($scope.item,'$scope.item is an object');
        assert.isArray($scope.thumbs,1,'$scope.thumbs is an array');

        assert.equal($scope.viewingItemId,1,'$scope.viewingItemId is 1');
        assert.equal($scope.showThumb ,false,'$scope.showThumb is false');
        assert.equal($scope.buyQuantity,1,'$scope.buyQuantity is 1');
        assert.equal($scope.viewLoading ,true,'$scope.viewLoading is true');

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

    it('should have public functions ', function(){

        $scope = {};
		controller = createController('itemController',$scope);
        assert.isFunction($scope.reload,'$scope.reload is a function');
        assert.isFunction($scope.addQty,'$scope.addQty is a function');
        assert.isFunction($scope.subQty,'$scope.subQty is a function');
        assert.isFunction($scope.toggleMainImage,'$scope.toggleMainImage is a function');
        assert.isFunction($scope.nextImage,'$scope.nextImage is a function');
        assert.isFunction($scope.prevImage,'$scope.prevImage is a function');
        assert.isFunction($scope.showStars,'$scope.showStars is a function');

    });

    describe('quanity and reviews functions ',function(){

        beforeEach(function(){
            $scope = {};
    		controller = createController('itemController',$scope);
        });

        it('should increment or decrement quantity ', function(){

            expect($scope.buyQuantity).to.equal(1,'$scope.buyQuantity');
            $scope.addQty();
            expect($scope.buyQuantity).to.equal(2,'$scope.buyQuantity');

            $scope.subQty()
            expect($scope.buyQuantity).to.equal(1,'$scope.buyQuantity');

        });

        it('should set number of max stars ', function(){

            expect($scope.showStars().length).to.equal(5,'$scope.showStars()');

        });

    });

    describe('slider functions ',function(){

        beforeEach(function(){
            $scope = {};
    		controller = createController('itemController',$scope);

            $scope.item.images = [];
            for(var i=1; i<=10; i=i+1){
                $scope.item.images.push({image:'IMAGE_'+i,isActive:(i==1)?true:false});
            }
        });

        it('should change the large image view ', function(){

            assert.isTrue($scope.item.images[0].isActive,'images[0].isActive is true');
            $scope.toggleMainImage();
            assert.isFalse($scope.item.images[0].isActive,'images[0].isActive is false');

        });

        it('should increment thumbnail value ', function(){

            expect($scope.thumbs[0]).to.equal(0,'$scope.thumbs[0]');
            $scope.nextImage();
            expect($scope.thumbs[0]).to.equal(1,'$scope.thumbs[0]');
        });

        it('should decrement thumbnail value ', function(){

            expect($scope.thumbs[0]).to.equal(0,'$scope.thumbs[0]');
            $scope.prevImage();
            expect($scope.thumbs[0]).to.equal($scope.item.images.length-1,'$scope.thumbs[0]');

        });
    })


})
