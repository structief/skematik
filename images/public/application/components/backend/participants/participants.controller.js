skematikControllers.controller('BeParticipantsController',["$scope", "$state", "$stateParams", "$rootScope", function($scope, $stateProvider, $stateParams, $rootScope) {
	$scope.participants = [
		{
			"mail": "big.j@student.be",
			"status": 1,
			"roles": ["student"]
		},
		{
			"mail": "francis.l@student.be",
			"status": 1,
			"roles": ["student"]
		},
		{
			"mail": "olga.v@docent.be",
			"status": 1,
			"roles": ["student", "docent", "admin"]
		},
		{
			"mail": "disabled.o@student.be",
			"status": 0,
			"roles": ["student"]
		},
		{
			"mail": "joseph.m@student.be",
			"status": 1,
			"roles": ["student"]
		},
		{
			"mail": "crazy.loe@student.be",
			"status": 1,
			"roles": ["student"]
		},
	];

	$scope.filter = {
		inactive: true,
		active: true,
		roles: ["student", "docent", "admin"]
	};

	$scope.system = {
		roles: ["student", "docent", "admin"]
	};

	//Write something to fetch the participants dynamically.


	//View functions
	$scope.toggleDropdown = function($event){
		angular.element($event.target).parent().parent().toggleClass("u__dropdown--show");
	};

	$scope.inRoles = function(roles, role){
		return roles.indexOf(role) !== -1;
	};

	$scope.toggleRole = function(roles, role){
		if($scope.inRoles(roles, role)){
			roles.splice(roles.indexOf(role), 1);
		}else{
			roles.push(role);
		}
	};

	$scope.filterParticipants = function(participant){
		//Check activity of participant
		if((participant.status && $scope.filter.active) || (!participant.status && $scope.filter.inactive)){
			//Check participant roles
			for(var i=0; i<participant.roles.length;i++){
				if($scope.inRoles($scope.filter.roles, participant.roles[i])){
					return true;
				}
			}
			return false;
		}else{
			return false;
		}
	};

	$scope.deleteParticipant = function(index){
		var deletedParticipant = $scope.participants[index];

		//Callback function for the alert
		var undoDeletion = function(){
			if(deletedParticipant !== null){
				$scope.participants.splice(index, 0, deletedParticipant);
				deletedParticipant = null;	
				$rootScope.$broadcast('alert.show', {title: "Actie ongedaan gemaakt!", message: "Beter opletten volgende keer, oké?", type: "success"}); 
			}
		}

		//Show alert
		$scope.participants.splice(index, 1);
		$rootScope.$broadcast('alert.show', {title: "Deelnemer is verwijderd", message: "Klik <u>hier</u> om deze actie ongedaan te maken", type: "warning", clickCallback: undoDeletion}); 
	}
}]);