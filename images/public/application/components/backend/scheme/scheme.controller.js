skematikControllers.controller('BeSchemeController',["$scope", "$state", "$stateParams", "$rootScope", function($scope, $stateProvider, $stateParams, $rootScope) {
	$scope.scheme = {
		id: $stateParams.schemeId
	}

	if($scope.scheme.id == 'new'){
		//Add some dummy content
		$scope.scheme.title = "A new scheme";
		$scope.scheme.cols = ['A string', 11, 'Click me!', '13:00', 14, 'Tomorrow'],
		$scope.scheme.rows = [
			{
				name: "First function",
				cols: [0,0,3,5,1,0]
			},
			{
				name: "Edit me via clicking",
				cols: [1,0,2,15,0,1]
			}
		]; 
	}else{
		//Fetch scheme

		//Dummy
		$scope.scheme = {
			id: $stateParams.schemeId,
			title: "My beautiful first scheme",
			rows: [
				{
					name: "First function",
					cols: [0,0,1,1,1,0,1,0]
				},
				{
					name: "Second function",
					cols: [1,1,1,1,0,1,0,1]
				}
			],
			cols: [10, 11, 12, 13, 14, 15, 16, 17]
		}
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
	$scope.addSpace = function(rowId, cellId, isDelete){
		if (!isDelete){
			$scope.scheme.rows[rowId].cols[cellId] = 1;
		}else{
			$scope.scheme.rows[rowId].cols[cellId]= false;
		}
		console.log($scope.scheme);
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

	//Column functions
	$scope.addColumn = function(position){
		var pos = 0;
		switch(position){
			case "before":
				//Do nothing, since it's already 0
				//Navigate to the newly added column
				$scope.nav.min = 0;
				break;
			case "after":
				pos = $scope.scheme.cols.length;
				//Navigate to the newly added column
				$scope.nav.min = pos - 7;
				break;
		}
		//Add a column
		$scope.scheme.cols.splice(pos, 0, "A row");
		
		//Make it empty for all rows
		for(var i = 0;i < $scope.scheme.rows.length; i++){
			$scope.scheme.rows[i].cols.splice(pos, 0, false);
		}
	}
	$scope.deleteColumn = function(columnId){
		//Delete column, but save it still for a few seconds until no undo is pressed
		var deletedColumn = {
			title: $scope.scheme.cols[columnId],
			values: []
		};
		for(var i = 0;i < $scope.scheme.rows.length; i++){
			deletedColumn.values.push($scope.scheme.rows[i].cols[columnId]);
		}

		//Remove column & values
		$scope.scheme.cols.splice(columnId, 1);
		for(var i = 0;i < $scope.scheme.rows.length; i++){
			$scope.scheme.rows[i].cols.splice(columnId, 1);
		}

		//Callback function for the alert
		var undoDeletion = function(){
			if(deletedColumn !== null){
				$scope.scheme.cols.splice(columnId, 0, deletedColumn.title);
				//Re-add values
				for(var i = 0;i < $scope.scheme.rows.length; i++){
					$scope.scheme.rows[i].cols.splice(columnId, 0, deletedColumn.values[i]);
				}
				deletedColumn = null;	
				$rootScope.$broadcast('alert.show', {title: "Action has been undone", message: "Watch out next time, okay?", type: "success", hide: 4000}); 
			}
		}

		//Show alert
		$rootScope.$broadcast('alert.show', {title: "Column is deleted", message: "To undo this action, click <u>here</u>", type: "warning", clickCallback: undoDeletion}); 
	}

	//Scheme functions
	$scope.saveScheme = function(){
		console.log($scope.scheme);
	}
}]);