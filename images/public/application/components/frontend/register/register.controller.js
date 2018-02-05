skematikControllers.controller('RegisterController',["$scope", "$state", "$stateParams", "$rootScope", function($scope, $stateProvider, $stateParams, $rootScope) {
	$scope.wizard = {
		"step": {
			"max": 3,
			"active": 1,
			"showErrors": false,
		}
	};

	$scope.new = {
		"organisation": {
			"name" : null
		},
		"account": {
			"mail": null,
			"password": null
		}
	};

	$scope.nextStep = function(required_elements){
		for(var i=0;i<required_elements.length;i++){
			if(required_elements[i] == null){
				$scope.wizard.step.showErrors = true;
				return;
			}
		}
		$scope.wizard.step.showErrors = false;
		$scope.wizard.step.active++;
	}
	$scope.prevStep = function(){
		$scope.wizard.step.active--;
	}

	$scope.register = function(){
		console.log($scope.new);
	}
}]);