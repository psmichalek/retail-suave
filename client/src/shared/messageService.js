angular.module('app')
.factory('Messages',['$sce',function($sce){

	var messages = {};
    messages.generalError = 'There has been a system error. ';
    messages.getItemsFailed = 'The items you were looking for are not available, please try again later.';
    return messages;

}]);
