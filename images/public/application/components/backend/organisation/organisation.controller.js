skematikControllers.controller('BeOrganisationController',["$scope", "$state", "$stateParams", "$rootScope", function($scope, $stateProvider, $stateParams, $rootScope) {
	$scope.tabList = {
		"tabs": {
			"users": "Gebruikers",
			"roles": "Rollen",
			"settings": "Instellingen"
		},
		"active": "users"
	};

	$scope.users = [
		{
			"name": "Koen Everaert",
			"mail": "resize@live.nl",
			"status": 1,
			"roles": ["admin", "superadmin", "superhero"]
		},
		{
			"name": "Jan Everaert",
			"mail": "some@crashlab.be",
			"status": 1,
			"roles": ["admin", "superadmin", "superhero"]
		},
		{
			"name": "David Deschouwere",
			"mail": "arandom@dude.com",
			"status": 0,
			"roles": ["docent"]
		}
	];

	$scope.roles = [
		{
			"name": "admin",
			"permissions": {
				"scheme": ["can-write", "can-read", "can-create"]
			}	
		},
		{
			"name": "superadmin",
			"permissions": {
				"scheme": ["can-write", "can-read", "can-create"], 
				"life": ["is-real"],
			}	
		},
		{
			"name": "superhero",
			"permissions": {
				"powers": ["can-fly", "can-defelect-bullets"], 
				"life": ["is-not-real"],
			}	
		}
	];
}]);