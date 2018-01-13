skematikControllers.controller('BeUsersController',["$scope", "$state", "$stateParams", function($scope, $stateProvider, $stateParams) {
	$scope.users = [
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
	};

	$scope.system = {
		roles: ["student", "docent", "admin"]
	};

	//Write something to fetch these dynamically.


	//View functions
	$scope.toggleDropdown = function($event){
		angular.element($event.target).parent().parent().toggleClass("u__dropdown--show");
	};

	$scope.inRoles = function(user, role){
		return user.roles.indexOf(role) !== -1;
	};
}]);