skematikControllers.controller('PopupController',["$scope", "$rootScope", "SchemeFactory", function($scope, $rootScope, SchemeFactory) {
	$scope.show = {
		popup: false
	}

	$rootScope.$on('popup.show', function(event, data) {
		$scope.show.popup = true;
		$scope.cell = data.cell;
		$scope.row = data.row;
		$scope.role = data.role;
	});

	$rootScope.$on('popup.hide', function(event, data) {
		if(data.wipe){
			$scope.cell = null;
			$scope.email = null;
			$scope.row = null;
		}
		$scope.closePopup();
	});

	$scope.closePopup = function(){
		$scope.show = {
			popup: false
		};
	}

	$scope.participate = function(){
		$rootScope.$broadcast('cell.participate', { 'cell': $scope.cell, 'participant': $scope.email });
	};
}]);