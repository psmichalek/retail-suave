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
