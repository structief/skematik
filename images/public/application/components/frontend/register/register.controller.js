skematikControllers.controller('RegisterController',["$scope", "$state", "$stateParams", "$rootScope", function($scope, $stateProvider, $stateParams, $rootScope) {
	$scope.activeStep = 0;

	$scope.nextStep = function(){
		$scope.activeStep++;
	}
}]);