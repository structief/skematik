skematikControllers.controller('TableController',["$scope", "$rootScope", "SchemeFactory", function($scope, $rootScope, SchemeFactory) {
	$scope.scheme = {
		uuid: $scope.uuid
	};
	$scope.nav = {
		min: 0
	}
	$scope.translation = {
		1: 'one',
		2: 'two',
		3: 'three',
		4: 'four',
		5: 'five',
		6: 'six',
		7: 'seven',
		8: 'eight'
	};
	$scope.classes = {
		1: 'twelve',
		2: 'six',
		3: 'four',
		4: 'three',
		5: 'two',
		6: 'two',
		7: 'one',
		8: 'one'
	};
	$scope.active = {
		"row": null,
		"cell": null
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

	$scope.participate = function(row, cell){
		$rootScope.$broadcast("sidebar.open");
		$scope.active = {
			"row": row,
			"cell": cell,
			"data": null
		};
	};

	$scope.saveParticipation = function(){
		SchemeFactory.participate({uuid: $scope.scheme.uuid}, {cellID: $scope.active.cell.uuid, participant: $scope.active.data.email}, function(response){
			//You're added, show a message & close popup!
			$rootScope.$broadcast('alert.show', {'title': "Yay", 'message': "You reserved a spot, congrats!", type: 'success'}); 
			$rootScope.$broadcast('sidebar.close',);

			//Update scheme
			if(response.scheme !== undefined){
				//Expect a scheme from the server
				$scope.scheme = response.scheme;
			}else{
				//Do this manually
				for(var i = 0; i < $scope.scheme.rows.length; i++){
					for(var j = 0; j < $scope.scheme.rows[i].cells.length; j++){
						if($scope.scheme.rows[i].cells[j].uuid == $scope.active.cell.uuid){
							$scope.scheme.rows[i].cells[j].current.push($scope.active.data.email);
						}
					}
				}
			}
		}, function(error){
			if(error.status == 401){
				//Show the error
				$rootScope.$broadcast('alert.show', {'title': "Sorry :(", 'message': "No seats left for this spot", type: 'error'}); 
			}else{
				//Show some error
				$rootScope.$broadcast('alert.show', {'title': "Though luck", 'message': "Something went wrong, try again later", type: 'warning'}); 
			}
		});
	};

	SchemeFactory.getOne({uuid: $scope.scheme.uuid}, function(response){
		if(response.status == 404){
			//Scheme not found
			$stateProvider.go('fe.entry');
			$rootScope.$broadcast('alert.show', {'title': "Scheme not found", 'message': "This UUID is not know in the database", type: 'error'}); 
		}else{
			//All is fine
			$scope.scheme = response;
		}
	});


}]);