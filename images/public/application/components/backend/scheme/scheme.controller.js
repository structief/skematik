skematikControllers.controller('BeSchemeController',["$scope", "$state", "$stateParams", "$rootScope", function($scope, $stateProvider, $stateParams, $rootScope) {
	$scope.scheme = {
		id: $stateParams.schemeId,
		rows: [
			{
				name: "First function",
				cols: [0,0,1,1,1,0,0,1,1,0,1]
			},
			{
				name: "Second function",
				cols: [1,1,1,1,0,0,1,0,1,0,0]
			}
		],
		cols: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
	}

	$scope.nav = {
		min: 0
	}

	// Functions
	$scope.next = function(){
		console.log($scope.nav.min);
		if($scope.nav.min + 8 < $scope.scheme.cols.length){
			$scope.nav.min++;
		}
	}
	$scope.previous = function(){
		if($scope.nav.min > 0){
			$scope.nav.min--;
		}
	}

	//Row functions
	$scope.toggleAvailability = function(rowId, cellId){
		$scope.scheme.rows[rowId].cols[cellId] = !$scope.scheme.rows[rowId].cols[cellId];
	}
	$scope.addRow = function(){
		$scope.scheme.rows.push({name: null, cols: new Array($scope.scheme.cols.length)});
	}
	$scope.deleteRow = function(rowId){
		//Delete row, but save it still for a few seconds until no undo is pressed
		var deletedRow = $scope.scheme.rows[rowId];
		$scope.scheme.rows.splice(rowId, 1);

		//Callback function for the alert
		var undoDeletion = function(){
			if(deletedRow !== null){
				$scope.scheme.rows.splice(rowId, 0, deletedRow);
				deletedRow = null;	
				$rootScope.$broadcast('alert.show', {title: "Action has been undone", message: "Watch out next time, okay?", type: "success"}); 
			}
		}

		//Show alert
		$rootScope.$broadcast('alert.show', {title: "Row was deleted", message: "To undo this action, click <u>here</u>", type: "warning", clickCallback: undoDeletion}); 
	}
}]);