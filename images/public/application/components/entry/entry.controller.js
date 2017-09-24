skematikControllers.controller('EntryController',["$scope", "$state", function($scope, $stateProvider) {
	$scope.input = {
		uuid: null
	};

	$scope.submitUUID = function(){
		if($scope.input.uuid){
			$stateProvider.go('fe.scheme', {tableId: $scope.input.uuid});
			$scope.input.error = null;
		}else{
			$scope.input.error = "Please provide a valid UUID";
		}
	}
}]);