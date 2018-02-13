skematikControllers.controller('BeAccountController',["$scope", "$state", "$stateParams", "AccountFactory", function($scope, $stateProvider, $stateParams, AccountFactory) {
	$scope.account = null;
	
	AccountFactory.getAccount().then(function(account){
		$scope.account = account;
	});

	$scope.logout = function(){
		AccountFactory.logout();
	}
}]);