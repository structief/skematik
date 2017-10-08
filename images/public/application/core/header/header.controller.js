skematikControllers.controller('HeaderController',["$scope", "$state", "$rootScope", "AccountFactory", function($scope, $stateProvider, $rootScope, AccountFactory) {
	$scope.account = null;

	//Check if account is logged in
	AccountFactory.getAccount().then(function(account){
		$scope.account = account;
	});


	$scope.$on("account.login", function(event, data){
		//An event fired when a user is logged in in
		$scope.account = data.account;
	});

	$scope.$on("account.logout", function(event, data){
		$scope.account = null;
	});

	$rootScope.$on('tokenHasExpired', function() {
	  console.log('Your session has expired!');
	});
}]);