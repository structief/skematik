skematikControllers.controller('AlertController',["$scope", "$rootScope", "$timeout", function($scope, $rootScope, $timeout) {
	$scope.alert = {
		show: false,
		icon: null, //Can be whatever you want, but it better be an image
		title: null, //String
		message: null, //The same, as long as it's a string
		type: 'error', //error, warning, info, success
		hide: 4000 //Can be false as well
	};

	$rootScope.$on('alert.show', function(event, data){	
		//Overwrite parameters
		Object.keys(data).forEach(function(key) {
			$scope.alert[key] = data[key];
		});

		//Show alert
		$scope.alert.show = true;

		//Fill up styling if necessary
		if(data.icon == null){
			switch($scope.alert.type){
				case 'error':
				default:
					$scope.alert.icon = "https://icongram.jgog.in/feather/alert-circle.svg?color=d91e18";
					$scope.alert.type = "error";
					break;
				case 'warning':
					$scope.alert.icon = "https://icongram.jgog.in/feather/help-circle.svg?color=ff4500"
					break;
				case 'info':
					$scope.alert.icon = "https://icongram.jgog.in/feather/info.svg?color=1e90ff"
					break;
				case 'success':
					$scope.alert.icon = "https://icongram.jgog.in/feather/check-circle.svg?color=00aa00"
					break;
			}
		}

		// Auto hide if necessary
		if($scope.alert.hide){
			$timeout(function(){
				$scope.alert.show = false;
			}, $scope.alert.hide);
		}
	});

	$scope.closeAlert = function(){
		$scope.alert.show = false;
	}
}]);
