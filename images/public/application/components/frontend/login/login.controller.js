skematikControllers.controller('LoginController',["$scope", "$state", "$stateParams", "AccountFactory", function($scope, $stateProvider, $stateParams, AccountFactory) {
	$scope.user = {
		username: null,
		password: null
	};

	$scope.wizard = {
		"step": {
			"active": 1
		}
	};

	$scope.login = function(){
		AccountFactory.login($scope.user).then(function(error){
			//*poef*, remove all classes
			$("input").removeClass("ng-wrong");

			//If the response contains data, it's an error
			$("input[ng-model='user." + error.field + "']").addClass("ng-wrong").focus();
		});
	}

	$scope.toStep = function(integer){
		$scope.wizard.step.active = integer;
	}

	$scope.possibleSubmit = function(event){
		if(event.keyCode == 13){
			$scope.login();
		}
	}

	//Watch input fields, remove "wrong"-class on edit
	$scope.$watch('user.username', function() {
       $("input[ng-model='user.username']").removeClass("ng-wrong");
    });
}]);