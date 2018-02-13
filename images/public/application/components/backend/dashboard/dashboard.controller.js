skematikControllers.controller('BeDashboardController',["$scope", "$state", "$stateParams", "SchemeFactory", function($scope, $stateProvider, $stateParams, SchemeFactory) {
	$scope.schemes = [];

	$scope.filter = {
		unpublished: true,
		published: true,
	}

	//Load schemes from be
	SchemeFactory.get({}, function(response){
		$scope.schemes = response;
	})
}]);