skematikControllers.controller('ConfirmController',["$scope", "$state", "$rootScope", "$http", "$stateParams", "$timeout", "ConfirmFactory", function($scope, $stateProvider, $rootScope, $http, $stateParams, $timeout, ConfirmFactory) {
	$scope.meta = {
		"icon": "icon--spin text--blue icon-loader",
		"message": {
			title: "Inschrijving bevestingen...",
			message: "Druk bezig met het bevestingen van jouw inschrijving..."
		}
	};
	ConfirmFactory.get({token: $stateParams.token}, function(response){
		//Okay, this worked.
		//Redirect with message to the scheme
		if(response.tableID){
			$scope.meta = {
				"icon": "text--green icon-check",
				"message": {
					title: "Inschrijving bevestigd!",
					message: "Yes, jouw inschrijving is bevestigd, we sturen je naar het schema!"
				}
			};
			$timeout(function(){
				$stateProvider.go('fe.scheme', {tableId: response.tableID});
			}, 3000);
		}else{
			$scope.meta = {
				"icon": "text--orange icon-alert-triangle",
				"message": {
					title: "Inschrijving onbekend",
					message: "We herkennen jouw bevestiging niet.. Heb je deze inschrijving al eens bevestigd?"
				}
			};
		}
	}, function(error){
		var icon = "text--red icon-x";
		switch(error.status){
			case 404:
				icon = "text--orange icon-help-circle";
				break;
			case 408:
				icon = "text--orange icon-alert-triangle";
				break;
		}
		$scope.meta = {
			"icon": icon,
			"message": {
				title: "Er is iets mis",
				message: error.data.message || "We krijgen de bevestiging niet door, er ging iets gek mis.."
			}
		};
		if(error.status == 408){
			$timeout(function(){
				$stateProvider.go('fe.scheme', {tableId: error.data.tableID});
			}, 3000);
		}
	});
}]);