skematikControllers.controller('StatusController',["$scope", "$state", "$rootScope", "$http", function($scope, $stateProvider, $rootScope, $http) {
	//Some things
	$scope.status = {
		apps: [
			{
				"name": "API",
				"url": "http://localhost:3000",
				"status": null
			},
			{
				"name": "Front-end",
				"url": "http://localhost:4000",
				"status": null
			},
			{
				"name": "Database",
				"url": "http://localhost:5432",
				"status": null
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

	$http({
		method: 'GET',
		url: 'http://localhost:3000/check'
	}).then(function successCallback(response) {
		var translate = {"API": 0, "FRONT": 1, "STORE": 2};
		for(var i = 0; i<response.data.length;i++){
			$scope.status.apps[translate[response.data[i].name]].status = response.data[i].status;
		}
	}, function errorCallback(response) {
		console.error(response);
	});
}]);