skematikControllers.controller('FooterController',["$scope", "$state", "$rootScope", "$location", function($scope, $stateProvider, $rootScope, $location) {
	//Yay
	$scope.hide = false;
	
	//Hide menu and footer on login & register page
	$rootScope.$on("menu.hide", function(event, data){
		$scope.hide = true;
	});
	$rootScope.$on("menu.show", function(event, data){
		$scope.hide = false;
	});
}]);