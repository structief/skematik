skematikControllers.controller('BeOrganisationController',["$scope", "$state", "$stateParams", "$rootScope", function($scope, $stateProvider, $stateParams, $rootScope) {
	$scope.tabList = {
		"tabs": {
			"users": "Gebruikers",
			"roles": "Rollen",
			"settings": "Instellingen"
		},
		"active": "users"
	};
}]);