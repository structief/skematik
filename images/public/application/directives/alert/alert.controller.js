skematikControllers.controller('AlertController',["$scope", "$rootScope", "$timeout", "$sce", function($scope, $rootScope, $timeout, $sce) {
	$scope.alerts = [];

	$rootScope.$on('alert.show', function(event, data){	
		var alert = {
			show: false,
			icon: null, //Can be whatever you want, but it better be an image
			title: null, //String
			message: null, //The same, as long as it's a string
			type: 'error', //error, warning, info, success
			hide: 4000, //Can be false as well
			clickCallback: null //Callback to be triggered when alert is clicked
		};

		//Overwrite parameters
		Object.keys(data).forEach(function(key) {
			alert[key] = data[key];
		});

		//Trust html in title and message
		alert.title = $sce.trustAsHtml(alert.title);
		alert.message = $sce.trustAsHtml(alert.message);

		//Fill up styling if necessary
		if(data.icon == null){
			switch(alert.type){
				case 'error':
				default:
					alert.icon = "https://icongr.am/feather/alert-circle.svg?color=d91e18";
					alert.type = "error";
					break;
				case 'warning':
					alert.icon = "https://icongr.am/feather/help-circle.svg?color=ff4500"
					break;
				case 'info':
					alert.icon = "https://icongr.am/feather/info.svg?color=1e90ff"
					break;
				case 'success':
					alert.icon = "https://icongr.am/feather/check-circle.svg?color=00aa00"
					break;
			}
		}

		//Show alert
		alert.show = true;

		//Add to alerts
		$scope.alerts.push(alert);

		// Auto hide if necessary
		if(alert.hide){
			var index = $scope.alerts.indexOf(alert);
			$scope.alerts[index].timeout = $timeout(function(){
				// @TODO: Index is changed, so 'index' does not match anymore
				$scope.alerts[index].show = false;
				$timeout(function(){
					$scope.alerts.splice(index, 1);
				}, 400);
			}, alert.hide);
		}
	});

	$scope.closeAlert = function(alertId){
		$scope.alerts[alertId].show = false;

		//Unset timeout from autohide
		$timeout.cancel($scope.alerts[alertId].timeout);

		//Wait until animation is done and delete element from array
		$timeout(function(){
			$scope.alerts.splice(alertId, 1);
		}, 400);
	};

	$scope.triggerClickCallback = function(alertId){
		var getType = {};
 		if($scope.alerts[alertId].clickCallback && getType.toString.call($scope.alerts[alertId].clickCallback) === '[object Function]'){
			$scope.closeAlert(alertId);
			$scope.alerts[alertId].clickCallback();
		}
	};
}]);
