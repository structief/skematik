skematikControllers.controller('BeParticipantsController',["$scope", "$state", "$stateParams", "$rootScope", "ParticipantsFactory", function($scope, $stateProvider, $stateParams, $rootScope, ParticipantsFactory) {
	$scope.participants = [];

	$scope.filter = {
		inactive: true,
		active: true,
		roles: []
	};

	$scope.system = {
		roles: [],
		import: false,
		editedParticipants: [],
		editMode: false,
	};

	//Fetch participants
	$scope.participants = [];
	ParticipantsFactory.get({}, function(participants){
		//Temp cleanup
		for(var i=0;i<participants.length;i++){
			$scope.participants.push({
				"name": participants[i].username,
				"mail": participants[i].usermail,
				"roles": participants[i].roles,
				"status": participants[i].status,
				"uuid": participants[i].uuid
			});
			for(var j=0;j<participants[i].roles.length;j++){
				if($scope.system.roles.indexOf(participants[i].roles[j]) === -1){
					//Add to system & filter
					$scope.system.roles.push(participants[i].roles[j]);
					$scope.filter.roles.push(participants[i].roles[j]);
				}
			}
		}
	});


	//View functions
	$scope.toggleDropdown = function($event){
		var el = findAncestor($event.target, "u__dropdown");
		$(el).toggleClass("u__dropdown--show");
	};
	//Helper
	var findAncestor = function (el, cls) {
		while(!el.classList.contains(cls)){
			el = el.parentElement;
		}
	    return el;
	}

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
		//Is user a temporary (new) user?
		if(participant.status == -1){
			return true;
		} 
		//Check activity of participant
		if((participant.status && $scope.filter.active) || (!participant.status && $scope.filter.inactive)){
			//Check participant roles
			for(var i=0; i<participant.roles.length;i++){
				if($scope.inRoles($scope.filter.roles, participant.roles[i])){
					return true;
				}
			}

			//If user does not have roles, but all roles are checked in the filter, just shown them already
			if($scope.system.roles.length == $scope.filter.roles.length && participant.roles.length == 0){
				return true;
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

	$scope.addParticipant = function($event){
		$scope.system.editMode = true;
		
		//Add new user
		$scope.participants.push({"mail": null, "status": -1, "roles": [], "uuid": null});

		//Toggle dropdown
		$scope.toggleDropdown($event);
	}

	$scope.editParticipant = function($index){
		$scope.system.editMode = true;

		//No biggy, store the current user, in case cancelling happens
		$scope.system.editedParticipants.push({"index": $index, "user": angular.copy($scope.participants[$index])});

		//Toggle state
		$scope.participants[$index].status = -1;
	}

	$scope.saveParticipant = function($index){
		//Change status to 1, that should do the trick
		$scope.participants[$index]["status"] = 1;
		$scope.system.editMode = false;
	}

	$scope.cancelEditParticipant = function($index){
		$scope.system.editMode = false;

		//Replace 'edited' particpant with the old one
		for(var i = 0; i < $scope.system.editedParticipants.length; i++){
			if($scope.system.editedParticipants[i].index == $index){
				//It's this one
				$scope.participants[$index] = $scope.system.editedParticipants[i].user;
				//Remove it from the system array
				$scope.system.editedParticipants.splice(i, 1);
				return true;
			}
		}
		//If we can't find one, it means that's a new user, so let's just delete it
		$scope.participants.splice($index, 1);
	}
}]);