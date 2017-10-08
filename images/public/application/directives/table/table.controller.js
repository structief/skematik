skematikControllers.controller('TableController',["$scope", "$rootScope", "SchemeFactory", function($scope, $rootScope, SchemeFactory) {
	$scope.scheme = {
		uuid: $scope.uuid
	};
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

	$scope.showPopup = function(row, cell){
		if(cell.current.length < cell.max){
			$rootScope.$broadcast('popup.show', {'row': row, 'cell': cell});
		}else{
			$rootScope.$broadcast('alert.show', {'title': "Sorry :(", 'message': "No seats left for this spot", type: 'error'}); 
		}
	};

	$rootScope.$on('cell.participate', function(event, data){
		SchemeFactory.participate({uuid: $scope.scheme.uuid}, {cellID: data.cell.uuid, participant: data.participant}, function(response){
			//You're added, show a message & close popup!
			$rootScope.$broadcast('alert.show', {'title': "Yay", 'message': "You reserved a spot, congrats!", type: 'success'}); 
			$rootScope.$broadcast('popup.hide', {wipe: true});

			//Update scheme
			if(response.scheme !== undefined){
				//Expect a scheme from the server
				$scope.scheme = response.scheme;
			}else{
				//Do this manually
				for(var i = 0; i < $scope.scheme.rows.length; i++){
					for(var j = 0; j < $scope.scheme.rows[i].cells.length; j++){
						if($scope.scheme.rows[i].cells[j].uuid == data.cell.uuid){
							$scope.scheme.rows[i].cells[j].current.push(data.participant);
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
	});

	//Fake data
	SchemeFactory.get({uuid: $scope.scheme.uuid}, function(response){
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