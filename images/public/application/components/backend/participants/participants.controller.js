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
		roles: ["student", "docent", "admin"],
		createParticipant: false
	};

	//Write something to fetch the participants dynamically.


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
		//Add new user
		$scope.participants.push({"mail": null, "status": -1, "roles": []});

		//Toggle dropdown
		$scope.toggleDropdown($event);
	}

	$scope.saveParticipant = function($index){
		//Change status to 1, that should do the trick
		$scope.participants[$index]["status"] = 1;
	}
}]);