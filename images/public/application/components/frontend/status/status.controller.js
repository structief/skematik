skematikControllers.controller('StatusController',["$scope", "$state", "$rootScope", "$http", function($scope, $stateProvider, $rootScope, $http) {
	//Some things
	$scope.status = {
		apps: [
			{
				"name": "API",
				"url": "http://localhost:3000",
				"status": -1
			},
			{
				"name": "Front-end",
				"url": "http://localhost:4000",
				"status": 1
			},
			{
				"name": "Database",
				"url": "http://localhost:5432",
				"status": 1
			},
			{
				"name": "Coffeemachine",
				"url": "http://localhost:0",
				"status": 0
			}
		],
		version: null,
		v: null,
		features: null
	}
	$http({
		method: 'GET',
		url: '/package.json'
	}).then(function successCallback(response) {
		$scope.status.version = response.data.version;
		$scope.status.v = response.data.v;
		$scope.status.features = response.data.features;
	}, function errorCallback(response) {
		console.error(response);
	});

	// @TODO: request app statuses from back-end
}]);