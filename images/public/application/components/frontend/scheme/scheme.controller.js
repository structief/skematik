skematikControllers.controller('SchemeController',["$scope", "$state", "$stateParams", function($scope, $stateProvider, $stateParams) {
	$scope.scheme = {
		id: $stateParams.tableId
	};
}]);