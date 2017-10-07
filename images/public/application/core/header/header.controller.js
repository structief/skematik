skematikControllers.controller('HeaderController',["$scope", "$state", "$rootScope", function($scope, $stateProvider, $rootScope) {
	$rootScope.$on('request.loading', function(event, config){
		console.log("AYYYY");
		console.log(config);
	});
}]);