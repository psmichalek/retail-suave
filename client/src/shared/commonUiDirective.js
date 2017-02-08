
(function(window,angular){

var mod = angular.module('retailsuave-ui',[]);

mod.directive('rsCheckbox',[function(){

	var directive 			= {};
	directive.defaults 		= {};

	var _scope          	= {};
        _scope.toggleOn		= "=";


	var _tmpl = ' '+
				'<span class="clickable fadein fadeout" ng-click="theSwitch=!theSwitch" style="display:inline-block;width:50px;">'+
				'<i class="fa" ng-class="{\'fa-square-o\':!theSwitch,\'fa-check-square-o\':theSwitch}"></i>'+
				'<span style="display:inline-block;margin-left:5px;" ng-transclude></span>';
				'</span> ';

	var _controller = function($scope, $element, $attrs){
		$scope.theSwitch = $scope.toggleOn;
		$scope.$watch("theSwitch", function(n,o){
            if(n!==o) $scope.toggleOn=n;
        });
        $scope.$watch("toggleOn", function(n,o){
            if(n!==o) $scope.theSwitch=n;
        });
	}

	var _link = function(scope, iElem, iAttrs){}

        directive.restrict      = 'E';
        directive.scope         = _scope;
        directive.template      = _tmpl;
        directive.controller    = _controller;
        directive.link          = _link;
        directive.transclude    = true;

        return directive;

}]);

mod.directive('rsLoading',[function(){

	var directive 				= {};
	directive.defaults 			= {};
	directive.defaults.text 	= '';
	directive.defaults.styles 	= {'color':'red','font-size':'0.9em','margin-top':'5px'};
	directive.defaults.showOn 	= false;
    directive.defaults.cssClass = '';

	var _scope          	= {};
        _scope.showOn		= "=";

	var _tmpl = ' '+
	'<span ng-style="xling" ng-class="winglet">'+
	'  <span style="display:inline-block;margin-right:3px;"><i class="fa fa-spinner fa-spin"></i></span>'+
	'  <span style="display:inline-block">{{yling}}</span>'+
	'</span>';

	var _controller = function($scope, $element, $attrs){

		$scope.yling = (typeof $attrs.text!=='undefined') ? $attrs.text : directive.defaults.text;
		$scope.xling = (typeof $attrs.styles!=='undefined') ? $attrs.styles : (typeof $attrs.cssClass==='undefined') ? directive.defaults.styles : '';
		$scope.zling = (typeof $scope.showOn!=='undefined') ? $scope.showOn : directive.defaults.showOn;
        $scope.winglet = (typeof $attrs.cssClass!=='undefined') ? $attrs.cssClass : directive.defaults.cssClass;

	}

	var _link = function(scope, iElem, iAttrs){}

        directive.restrict      = 'E';
        directive.scope         = _scope;
        directive.template      = _tmpl;
        directive.controller    = _controller;
        directive.link          = _link;

        return directive;

}]);

mod.directive('rsHelp',[function(){

	var directive 				= {};
	directive.defaults 			= {};
	directive.defaults.mesg 	= 'No help available at this time.';
	directive.defaults.cssClass = 'blue-font';
	directive.defaults.location = 'top';
	directive.defaults.trigger 	= 'hover';
	directive.defaults.container = 'body';

	var _scope          	= {};
        _scope.mesg			= "=";
        _scope.cssClass		= "=";

	var _tmpl = ' '+
			'<span ' +
				'style="cursor:pointer;" ' +
				'ng-class="winglet" ' +
				'data-placement="{{ninglet}}" ' +
				'data-trigger="{{jinglet}}" ' +
				'data-container="{{binglet}}" ' +
				'bs-popover="xinglet" '+
			'>'+
			'<i class="fa fa-question-circle"></i>'+
			'</span>';

	var _controller = function($scope, $element, $attrs){
		$scope.xinglet = (typeof $scope.mesg!=='undefined') ? $scope.mesg : directive.defaults.mesg;
		$scope.winglet = (typeof $scope.cssClass!=='undefined') ? $scope.cssClass : directive.defaults.cssClass;
		$scope.ninglet = (typeof $attrs.location!=='undefined') ? $attrs.location : directive.defaults.location;
		$scope.jinglet = (typeof $attrs.trigger!=='undefined') ? $attrs.trigger : directive.defaults.trigger;
		$scope.binglet = (typeof $attrs.container!=='undefined') ? $attrs.container : directive.defaults.container;
	}

	var _link = function(scope, iElem, iAttrs){}

        directive.restrict      = 'E';
        directive.scope         = _scope;
        directive.template      = _tmpl;
        directive.controller    = _controller;
        directive.link          = _link;

        return directive;

}]);

mod.directive('rsNotify',['$timeout','$sce',function($timeout,$sce){

        var directive               = {};
        directive.defaults 			= {};
		directive.defaults.type 	= 'danger';
		directive.defaults.showOn	= false;
		directive.defaults.showFor	= 5000;
		directive.types = [
        	{key:'info',name:'alert alert-info'},
        	{key:'danger',name:'alert alert-danger'},
            {key:'error',name:'alert alert-danger'},
        	{key:'success',name:'alert alert-success'},
        	{key:'warning',name:'alert alert-warning'}
        ];

        var _scope          = {};
        _scope.showOn     	= "=";
        _scope.type      	= "=";
        _scope.showFor  	= "=";

        var _tmpl = ' '+
        	'<div role="alert" '+
        	'class="fadein fadeout" '+
        	'ng-show="showOn" '+
        	'ng-class="alertClass.name">'+
            '  <a href="#" class="close" data-dismiss="alert" ng-click="close()">&times;</a>'+
            '  <span style="font-weight:700"><i class="fa fa-exclamation-triangle space-right-5"></i></span>'+
            '  <span ng-transclude></span>'+
            '</div>';

        var _controller = function($scope, $element, $attrs){

            if(typeof $scope.showOn==='undefined')
            	$scope.showOn = directive.defaults.showOn;

            if(typeof $scope.showFor==='undefined')
            	$scope.showFor = directive.defaults.showFor;

    		var _reset = function(){
    			$scope.type='';
    			$scope.showOn=false;
    		}

    		var _settype = function(){
    			if(typeof $scope.showFor==='undefined') $scope.showFor=directive.defaults.showFor;
    			return (typeof $scope.type!=='undefined' && $scope.type!='') ? $scope.type : directive.defaults.type;
    		}

            var _timer = function() {
            	$timeout( _reset ,$scope.showFor);
            }

            var _setname = function(type) {
            	var key = type.toLowerCase();
            	function _getalert(){ return _.find(directive.types,{key:key}); }
	           	if( _.isUndefined( _getalert(key) ) ) $scope.alertClass = directive.types[0].name;
	           	else $scope.alertClass = _getalert(key);
	           	//console.log('scope.alertClass ',$scope.alertClass);
            }

            $scope.$watch("showOn", function(newVal,oldVal){
            	if(newVal!==oldVal && newVal) {
            		//console.log('showOn $scope.type ',$scope.showFor)
            		_setname(_settype()); _timer();
            	}
            });

            // $scope.$watch("type", function(newVal,oldVal){
            // 	if(newVal!=oldVal && oldVal!='') _setname(newVal);
            // });

            _setname(_settype());

        }

        var _link = function(scope, iElem, iAttrs){
			scope.close=function(){scope.type=''; scope.showOn=false; scope.showFor=directive.defaults.showFor;}
        }

        directive.restrict      = 'E';
        directive.scope         = _scope;
        directive.template      = _tmpl;
        directive.controller    = _controller;
        directive.link          = _link;
        directive.transclude	= true;

        return directive;

}]);

mod.directive('wrsFilez',[function(){

    var _scope = {
        onSelect: '&?',
        file: '=?',
        accept: '@?'
    }

    var _tmpl = '<input style="display:none;" type="file" accept="{{accept}}" /><div ng-transclude></div>';

    var _link = function(scope,element){
        var fileInput = element.find('input')[0];
        element.bind('click', function () {
            fileInput.focus();
            fileInput.click();
        });
        element.bind('change', function (event) {
            var file = event.target.files[0];
            scope.onSelect({file: file});
            scope.file = file;
            scope.$apply(); //May not update file immediately otherwise
        });
    }

    var directive           = {};
    directive.restrict      = 'A';
    directive.transclude    = true;
    directive.scope         = _scope;
    directive.template      = _tmpl
    directive.link          = {post:_link};
    return directive;

}]);

})(window,angular);
