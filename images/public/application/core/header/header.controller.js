skematikControllers.controller('HeaderController',["$scope", "$state", "AccountFactory", function($scope, $stateProvider, AccountFactory) {
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
}]);