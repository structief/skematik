skematikControllers.controller('HeaderController',["$scope", "$state", "$rootScope", "AccountFactory", function($scope, $stateProvider, $rootScope, AccountFactory) {
	$scope.account = null;

	//Check if account is logged in
	AccountFactory.isLoggedIn().then(function(data){
		if(data){
			$scope.account = AccountFactory.getAccount();
		}
	});

	$scope.$on("account.login", function(event, data){
		$scope.account = data.account;
	});

	$scope.$on("account.logout", function(event, data){
		$scope.account = null;
	});

	$rootScope.$on('request.loading', function(event, config){
		console.log("AYYYY");
		console.log(config);
	}
}]);