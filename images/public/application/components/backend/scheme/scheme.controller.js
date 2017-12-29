skematikControllers.controller('BeSchemeController',["$scope", "$state", "$stateParams", "$rootScope", "SchemeFactory", function($scope, $stateProvider, $stateParams, $rootScope, SchemeFactory) {
	$scope.scheme = {
		uuid: $stateParams.schemeUuid
	}

	$scope.isEditing = false;

	if($scope.scheme.uuid == 'new'){
		$scope.isEditing = true;
		//Add some dummy content
		$scope.scheme.title = "A new scheme";
		$scope.scheme.headers = ['A string', 11, 'Click me!', '13:00', 14, 'Tomorrow'],
		$scope.scheme.rows = [
			{
				name: "First function",
				cells: [
					{max: 0},
					{max: 0},
					{max: 3},
					{max: 5},
					{max: 1},
					{max: 0}
				]
			},
			{
				name: "Edit me via clicking",
				cells: [
					{max: 1},
					{max: 0},
					{max: 2},
					{max: 15},
					{max: 0},
					{max: 1}
				]
			}
		]; 
	}else{
		//Fetch scheme
		SchemeFactory.getOne({uuid: $scope.scheme.uuid}, function(scheme){
			$scope.scheme = scheme;
		}, function(error){
			console.error(error);
		});
	}

	$scope.nav = {
		min: 0
	}

	// Functions
	$scope.next = function(){
		if($scope.nav.min + 8 < $scope.scheme.headers.length){
			$scope.nav.min++;
		}
	}
	$scope.previous = function(){
		if($scope.nav.min > 0){
			$scope.nav.min--;
		}
	}
	$scope.toggleEditMode = function(){
		$scope.isEditing = !$scope.isEditing;
	}

	//Row functions
	$scope.addSpace = function(rowId, cellId, isDelete){
		if (!isDelete){
			$scope.scheme.rows[rowId].cells[cellId].max = 1;
		}else{
			$scope.scheme.rows[rowId].cells[cellId].max = false;
		}
	}
	$scope.addRow = function(){
		//Create empty cells in row
		var cells = [];
		for(var i=0;i<$scope.scheme.headers.length;i++){
			cells.push({max: 0});
		}
		$scope.scheme.rows.push({name: null, cells: cells});
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
				pos = $scope.scheme.headers.length;
				//Navigate to the newly added column
				$scope.nav.min = pos - 7;
				break;
		}
		//Add a column
		$scope.scheme.headers.splice(pos, 0, "A row");
		
		//Make it empty for all rows
		for(var i = 0;i < $scope.scheme.rows.length; i++){
			$scope.scheme.rows[i].cells.splice(pos, 0, {max: 0});
		}
	}
	$scope.deleteColumn = function(columnId){
		//Delete column, but save it still for a few seconds until no undo is pressed
		var deletedColumn = {
			title: $scope.scheme.headers[columnId],
			values: []
		};
		for(var i = 0;i < $scope.scheme.rows.length; i++){
			deletedColumn.values.push($scope.scheme.rows[i].cells[columnId]);
		}

		//Remove column & values
		$scope.scheme.headers.splice(columnId, 1);
		for(var i = 0;i < $scope.scheme.rows.length; i++){
			$scope.scheme.rows[i].cells.splice(columnId, 1);
		}

		//Callback function for the alert
		var undoDeletion = function(){
			if(deletedColumn !== null){
				$scope.scheme.headers.splice(columnId, 0, deletedColumn.title);
				//Re-add values
				for(var i = 0;i < $scope.scheme.rows.length; i++){
					$scope.scheme.rows[i].cells.splice(columnId, 0, deletedColumn.values[i]);
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
		console.log("Let's save!");

		if($scope.scheme.uuid == 'new'){
			//Do a post to save it, and store the response
			SchemeFactory.post({scheme: $scope.scheme}, function(response){
				$scope.scheme = response;

				//Show alert
				$rootScope.$broadcast('alert.show', {title: "Schema created", message: "Yas, we saved everything!", type: "success"}); 
			}, function(error){
				console.error(error);
			});
		}else{
			//Save the existing scheme with a put
			SchemeFactory.update({uuid: $scope.scheme.uuid, scheme: $scope.scheme}, function(response){
				$scope.scheme = response;
				console.log(response);

				//Show alert
				$rootScope.$broadcast('alert.show', {title: "Changes saved", message: "Yas, we saved everything!", type: "success"}); 
			}, function(error){
				console.error(error);
			});
		}
	}

	$scope.discardChanges = function(){
		$scope.isEditing = false;
		//Fetch scheme again, to discard the changes
		SchemeFactory.getOne({uuid: $scope.scheme.uuid}, function(scheme){
			$scope.scheme = scheme;

			//Show alert
			$rootScope.$broadcast('alert.show', {title: "Changes thrown away", message: "Changes were discarded, back to what you had!", type: "success"}); 
		}, function(error){
			console.error(error);
		});
	}
}]);