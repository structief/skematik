skematikControllers.controller('TableController',["$scope", "$rootScope", "SchemeFactory", "$state", function($scope, $rootScope, SchemeFactory, $stateProvider) {
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
	};

	$scope.participations = []; // List of {row, cell}-objects for the active subscription, BEFORE entering email or other identification
	
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
		//Depending on login-state, show different information
		if($rootScope.isAuthenticated){
			$rootScope.$broadcast("sidebar.open", {uuid: "participants-overview"});
		}else{
			$rootScope.$broadcast("sidebar.open", {uuid: "schedule-participate"});
			$scope.participations.push({"row": row, "cell": cell});
		}
		$scope.active = {
			"row": row,
			"cell": cell,
			"data": null
		};
	};
	$scope.removeParticipation = function(par, cell){
		//If 'cell' is set, "par" is the row
		if(cell !== null && cell != undefined){
			for(var i=0; i < $scope.participations.length; i++){
				if(par == $scope.participations[i].row && cell == $scope.participations[i].cell){
					$scope.participations.splice(i, 1);
					return;
				}
			}
		}else{
			$scope.participations.splice($scope.participations.indexOf(par), 1);
		}
	} 

	$scope.saveParticipation = function(){
		SchemeFactory.participate({uuid: $scope.scheme.uuid}, {participations: $scope.participations, participant: $scope.active.data.email}, function(response){
			//You're added, show a message & close sidebar!
			$rootScope.$broadcast('alert.show', {'title': "Yay", 'message': "You reserved them spot(s), congrats!", type: 'success'}); 
			$rootScope.$broadcast('sidebar.close', {uuid: "schedule-participate"});

			//Update scheme
			if(response.scheme !== undefined){
				//Expect a scheme from the server
				$scope.scheme = response.scheme;
			}else{
				//Reload the page for updates
				window.location.reload();
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
		//All is fine
		$scope.scheme = response;
	}, function(error){
		if(error.status == 404){
			//Scheme not found
			$stateProvider.go('fe.entry');
			$rootScope.$broadcast('alert.show', {'title': "Scheme not found", 'message': "This UUID is not know in the database", type: 'error'}); 
		}
	});

	$scope.inParticipations = function(row, cell){
		for(var i=0; i < $scope.participations.length; i++){
			if(row == $scope.participations[i].row && cell == $scope.participations[i].cell){
				return true;
			}
		}
		return false;
	}
}]);