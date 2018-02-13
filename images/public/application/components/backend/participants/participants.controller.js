skematikControllers.controller('BeParticipantsController',["$scope", "$state", "$stateParams", "$rootScope", "ParticipantsFactory", function($scope, $stateProvider, $stateParams, $rootScope, ParticipantsFactory) {
	$scope.participants = [];
	$scope.new = {
		'username': ""
	};

	$scope.filter = {
		inactive: true,
		active: true,
		roles: []
	};

	$scope.system = {
		roles: [],
		import: false,
		edit: null,
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
		if(roles !== undefined){
			return roles.indexOf(role) !== -1;
		}else{
			return false;
		}
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
		$scope.system.edit = {"index": -1, "user": {"mail": null, "status": 1, "roles": [], "uuid": null}};
		$rootScope.$broadcast("sidebar.open", {uuid: "edit-participant"});

		//Toggle dropdown
		$scope.toggleDropdown($event);
	}

	$scope.editParticipant = function($index){
		$scope.system.edit = {"index": $index, "user": angular.copy($scope.participants[$index])};

		//Toggle sidebar
		$rootScope.$broadcast("sidebar.open", {uuid: "edit-participant"});
	}

	$scope.saveParticipant = function(){
		//Add or update the user
		if($scope.system.edit.index > -1){
			//Update
			$scope.participants[$scope.system.edit.index] = angular.copy($scope.system.edit.user);
		}else{
			$scope.participants.push(angular.copy($scope.system.edit.user));
		}

		//Toggle sidebar
		$rootScope.$broadcast("sidebar.close", {uuid: "edit-participant"});
	}
}]);