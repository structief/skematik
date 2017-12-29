skematikControllers.controller('BeDashboardController',["$scope", "$state", "$stateParams", "SchemeFactory", function($scope, $stateProvider, $stateParams, SchemeFactory) {
	$scope.schemes = [];

	//Load schemes from be
	SchemeFactory.get({}, function(response){
		$scope.schemes = response;
	})
}]);