skematikControllers.controller('EntryController',["$scope", "$state", "$rootScope", function($scope, $stateProvider, $rootScope) {
	$scope.input = {
		uuid: null
	};

	$scope.submitUUID = function(){
		if($scope.input.uuid){
			$stateProvider.go('fe.scheme', {tableId: $scope.input.uuid});
			$scope.input.error = null;
		}else{
			$rootScope.$broadcast('alert.show', {'title': "Not a valid UUID", 'message': "Try entering a valid UUID", type: 'error'}); 
			$scope.input.error = true;
		}
	}
}]);