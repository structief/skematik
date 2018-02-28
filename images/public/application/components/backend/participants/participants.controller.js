skematikControllers.controller('BeParticipantsController',["$scope", "$state", "$stateParams", "$rootScope", "ParticipantsFactory", "RolesFactory", "$timeout", function($scope, $stateProvider, $stateParams, $rootScope, ParticipantsFactory, RolesFactory, $timeout) {
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
		status: [
			{
				value: 1,
				label: "Actief"
			},
			{
				value: 0,
				label: "Inactief"
			}
		]
	};

	//Fetch participants
	ParticipantsFactory.get({}, function(participants){
		$scope.participants = participants;
	});

	//Fetch roles
	RolesFactory.get({}, function(roles){
		//Determine system roles
		for(var j=0;j<roles.length;j++){
			$scope.system.roles.push({
				"uuid": roles[j].uuid,
				"type": roles[j].type,
				"short": roles[j].short
			});
		}
		//Add them to filter
		$scope.filter.roles = angular.copy($scope.system.roles);
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
		//Compare uuids
		if(roles !== undefined){
			for(var i=0; i<roles.length; i++){
				if(roles[i].uuid == role.uuid){
					return true;
				}
			}
			return false;
		}else{
			return false;
		}
	};

	$scope.toggleRole = function(roles, role){
		if($scope.inRoles(roles, role)){
			//Find index of role
			for(var i=0;i<roles.length;i++){
				if(roles[i].uuid == role.uuid){
					roles.splice(i, 1);
				}
			}
		}else{
			roles.push(role);
		}
	};

	$scope.editRoles = function(participant, role){
		$scope.toggleRole(participant.roles, role);
		ParticipantsFactory.update({participants: [participant]}, function(success){}, function(error){
			$scope.toggleRole(participant.roles, role);
		});
	};

	$scope.editStatus = function(participant, status){
		var oldStatus = participant.status;
		participant.status = status;
		ParticipantsFactory.update({participants: [participant]}, function(success){}, function(error){
			participant.status = oldStatus;
		});
	}

	$scope.filterParticipants = function(participant){
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
		var timeout = $timeout(function(){
			ParticipantsFactory.delete({uuid: deletedParticipant.uuid});
		}, 4000);

		//Callback function for the alert
		var undoDeletion = function(){
			if(deletedParticipant !== null){
				//Cancel server deletion
				$timeout.cancel(timeout);

				//Re-place participant
				$scope.participants.splice(index, 0, deletedParticipant);
				deletedParticipant = null;	
				$rootScope.$broadcast('alert.show', {title: "Actie ongedaan gemaakt!", message: "Beter opletten volgende keer, oké?", type: "success"}); 
			}
		}

		//Show alert
		$scope.participants.splice(index, 1);
		$rootScope.$broadcast('alert.show', {title: "Deelnemer is verwijderd", message: "Klik <u>hier</u> om deze actie ongedaan te maken", type: "warning", clickCallback: undoDeletion, hide: 4000}); 
	};

	$scope.addParticipant = function($event){
		$scope.system.edit = {"index": -1, "user": {"mail": null, "status": 1, "roles": [], "uuid": null}};
		$rootScope.$broadcast("sidebar.open", {uuid: "edit-participant"});

		//Toggle dropdown
		$scope.toggleDropdown($event);
	};

	$scope.editParticipant = function($index){
		$scope.system.edit = {"index": $index, "user": angular.copy($scope.participants[$index])};

		//Toggle sidebar
		$rootScope.$broadcast("sidebar.open", {uuid: "edit-participant"});
	};

	$scope.saveParticipant = function(){
		//Add or update the user
		if($scope.system.edit.index > -1){
			//Update
			ParticipantsFactory.update({participants: [$scope.system.edit.user]}, function(success){
				$scope.participants[$scope.system.edit.index] = angular.copy($scope.system.edit.user);

				//Toggle sidebar
				$rootScope.$broadcast("sidebar.close", {uuid: "edit-participant"});
			}, function(error){});
		}else{
			//Send the new dude to the server
			ParticipantsFactory.create({participants: [{mail: $scope.system.edit.user.mail, roles: $scope.system.edit.user.roles, status: $scope.system.edit.user.status}]}, function(success){
				$scope.system.edit.user.uuid = success.uuid;
				$scope.participants.push(angular.copy($scope.system.edit.user));
			
				//Toggle sidebar
				$rootScope.$broadcast("sidebar.close", {uuid: "edit-participant"});
			}, function(error){
				$rootScope.$broadcast('alert.show', {title: "Server error", message: "Deelnemer werd niet toegevoegd, probeer later nogmaals.", type: "error"}); 
			});
		}
	};
}]);