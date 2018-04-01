skematikControllers.controller('HeaderController',["$scope", "$state", "$rootScope", "AccountFactory", "$location", function($scope, $stateProvider, $rootScope, AccountFactory, $location) {
	$scope.hide = false;
	$scope.account = null;
	$scope.isMenuActive = false;

	//Check if account is logged in
	if($rootScope.isAuthenticated){
		AccountFactory.getAccount().then(function(account){
			$scope.account = account;
		}, function(reject){
			//Rejected, probably a 401
		});
	}


	$scope.$on("account.login", function(event, data){
		//An event fired when a user is logged in in
		$scope.account = data.account;
	});

	$scope.$on("account.logout", function(event, data){
		$scope.account = null;
	});

	//Hide menu and footer on login & register page
	$rootScope.$on("menu.hide", function(event, data){
		$scope.hide = true;
	});
	$rootScope.$on("menu.show", function(event, data){
		$scope.hide = false;
	});

	$rootScope.$on('tokenHasExpired', function() {
	  console.log('Your session has expired!');
	});
}]);