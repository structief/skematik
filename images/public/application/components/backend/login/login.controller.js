skematikControllers.controller('BeLoginController',["$scope", "$state", "$stateParams", "AccountFactory", function($scope, $stateProvider, $stateParams, AccountFactory) {
	$scope.user = {
		username: null,
		password: null
	};

	$scope.login = function(){
		AccountFactory.login($scope.user).then(function(error){
			//If the response contains data, it's an error
			$scope.error = error.message;
		});
	}

}]);