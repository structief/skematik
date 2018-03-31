skematikControllers.controller('BeSchemeController',["$scope", "$state", "$stateParams", "$rootScope", "SchemeFactory", "RolesFactory", "$location",function($scope, $stateProvider, $stateParams, $rootScope, SchemeFactory, RolesFactory, $location) {
	$scope.scheme = {
		uuid: $stateParams.schemeUuid
	}

	$scope.isEditing = false;
	$scope.system = {
		"isEditing": false,
		"edit": null,
		"roles": []
	};

	//Fetch scheme
	SchemeFactory.getOne({uuid: $scope.scheme.uuid}, function(scheme){
		$scope.scheme = scheme;
	}, function(error){
		console.error(error);
	});

	//Fetch roles
	RolesFactory.get({}, function(roles){
		for(var i=0;i<roles.length;i++){
			$scope.system.roles.push(roles[i].type);
		}
	});

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
	$scope.inRoles = function(roles, role){
		if(roles !== undefined){
			return roles.indexOf(role) !== -1;
		}else{
			return false;
		}
	}
	$scope.toggleRole = function(roles, role){
		if($scope.inRoles(roles, role)){
			roles.splice(roles.indexOf(role), 1);
		}else{
			roles.push(role);
		}
	}

	$scope.editSchemeMeta = function(){
		$rootScope.$broadcast("sidebar.open", {uuid: "scheme-sidebar-backend"});
		$scope.system.edit = {
			"title": angular.copy($scope.scheme.title),
			"status": angular.copy($scope.scheme.status).toString(),
			"publication": { // YYYY-MM-DD
				"from": angular.copy($scope.scheme.publication.from).toString().substring(0, 10),
				"to": angular.copy($scope.scheme.publication.to).toString().substring(0, 10)
			},
			"roles": angular.copy($scope.scheme.roles),
			"consumer": angular.copy($scope.scheme.consumer)
		};
	}

	$scope.saveSchemeMeta = function(){
		$scope.scheme.title = angular.copy($scope.system.edit.title);
		$scope.scheme.roles = angular.copy($scope.system.edit.roles);
		$scope.scheme.status = angular.copy($scope.system.edit.status);
		$scope.scheme.publication = angular.copy($scope.system.edit.publication);
		$scope.scheme.consumer = angular.copy($scope.system.edit.consumer);

		$scope.saveScheme();
		$rootScope.$broadcast("sidebar.close", "scheme-sidebar-backend");
	}

	$scope.exportParticipations = function(){
        var str = 'UUID,participant,created_at,updated_at,row,column\r\n';

        for (var i = 0; i < $scope.scheme.answers.length; i++) {
            var line = '';
            for (var index in $scope.scheme.answers[i]) {
                if (line != '') line += ','

                line += $scope.scheme.answers[i][index];
            }

            str += line + '\r\n';
        }
		var encodedUri = encodeURI(str);
		var link = document.createElement("a");
		link.setAttribute("href", "data:text/csv;charset=utf-8," + encodedUri);
		link.setAttribute("target", "_blank");
		link.setAttribute("download", "my_data.csv");
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click(); 
   		document.body.removeChild(link); 
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
		if($scope.scheme.uuid == 'new'){
			//Do a post to save it, and store the response
			SchemeFactory.create({scheme: $scope.scheme}, function(response){
				$scope.scheme = response;

				//Update url with uuid
				$location.url("admin/scheme/" + $scope.scheme.uuid);

				//Show alert
				$rootScope.$broadcast('alert.show', {title: "Schema created", message: "Yas, we saved everything!", type: "success"}); 
			}, function(error){
				console.error(error);
			});
		}else{
			//Save the existing scheme with a put
			SchemeFactory.update({uuid: $scope.scheme.uuid, scheme: $scope.scheme}, function(response){
				$scope.scheme = response;
				$scope.isEditing = false;

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