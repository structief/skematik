skematikControllers.controller('ConfirmController',["$scope", "$state", "$rootScope", "$http", "$stateParams", "$timeout", "ConfirmFactory", function($scope, $stateProvider, $rootScope, $http, $stateParams, $timeout, ConfirmFactory) {
	$scope.meta = {
		"icon": "icon--spin text--blue icon-loader",
		"message": "Confirming your subscription..."
	};
	ConfirmFactory.get({token: $stateParams.token}, function(response){
		//Okay, this worked.
		//Redirect with message to the scheme
		if(response.tableID){
			$scope.meta = {
				"icon": "text--green icon-check",
				"message": "Yes, that's confirmed!"
			};
			$timeout(function(){
				$stateProvider.go('fe.scheme', {tableId: response.tableID});
			}, 2000);
		}else{
			$scope.meta = {
				"icon": "text--orange icon-alert-triangle",
				"message": "We don't know that confirmation (anymore)."
			};
		}
	}, function(error){
		$scope.meta = {
			"icon": "text--red icon-x",
			"message": "Can't confirm, please try again later!"
		};
	});
}]);