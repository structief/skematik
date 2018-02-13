skematikControllers.controller('RegisterController',["$scope", "$state", "$stateParams", "$rootScope", "AccountFactory", function($scope, $stateProvider, $stateParams, $rootScope, AccountFactory) {
	$scope.wizard = {
		"step": {
			"max": $(".wizard__step").size(),
			"active": 1
		}
	};

	$scope.new = {
		"organisation": {
			"name" : null
		},
		"account": {
			"givenName": null,
			"familyName": null,
			"mail": null,
			"password": null
		}
	};

	$scope.nextStep = function(){
		//Read required elements
		var req_elements = $(".wizard__step:not(.ng-hide) input[required]");
		for(var i=0;i<req_elements.length;i++){
			var el = req_elements[i];
			//Check classes for validity, not the best way, but it works in an MVP
			if($(el).hasClass("ng-invalid") || $(el).hasClass("ng-empty")){
				$(el).focus();
				return false;
			}
		}
		$scope.wizard.step.active++;
		return true;
	}
	$scope.prevStep = function(){
		$scope.wizard.step.active--;
	}

	$scope.register = function(){
		if($scope.nextStep()){
			AccountFactory.api.register($scope.new, function(response){
				//Okay, this worked.
			}, function(error){
				$scope.prevStep();
				console.log(error);
			});
		}else{
			//Error zeg ik
			console.log(error);
		}
	}
}]);