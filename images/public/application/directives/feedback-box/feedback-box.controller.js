skematikControllers.controller('FeedbackBoxController',["$scope", "$rootScope", "$timeout", "$sce", "$location", "FeedbackFactory", function($scope, $rootScope, $timeout, $sce, $location, FeedbackFactory) {
	//Just get the reacted pages already
	$scope.reactedTo = JSON.parse(localStorage.getItem('feedback'));
	$scope.feedbackAvailableForThisPage = true;
	$scope.message = null;

	$scope.step = {
		index: 0, 
		name: null
	};

	$scope.reactions = {
		'joy': {
			'emoji': 'heart_eyes',
			'tooltip': 'Love it!',
			'success': 'Glad that you like it!'
		},
		'lost': {
			'emoji': 'face_with_monocle',
			'tooltip': 'Can\'t find something',
			'success': 'Hmmm..we\'ll look into it'
		},
		'amazing': {
			'emoji': 'astonished',
			'tooltip': 'Amazing!',
			'success': 'It really is amazing, isn\'t it?'
		},
		'cry': {
			'emoji': 'cry',
			'tooltip': 'Not what I expected',
			'success': 'Thanks for the feedback, we\'ll do better next time!'
		},
		'rage': {
			'emoji': 'rage',
			'tooltip': 'Hate it!',
			'success': 'We\'re sorry you feel that way..'
		}
	};

	$scope.toStep = function(name, index){
		//Add step
		$scope.step.index = index;
		$scope.step.name = name;
	}

	$scope.saveReaction = function(name){
		$scope.step.index = 2;
		$scope.success = {
			'name': name,
			'emoji': $scope.reactions[name].emoji,
			'message': $scope.reactions[name].success,
			'url': $location.url()
		};

		console.log($scope.message);
		//Send $scope.success to certain endpoint
		FeedbackFactory.sendFeedback({"feeling": $scope.success.name, "message": $scope.message, "url": $scope.success.url}, function(response){
			//Add this page to the localStorage
			if($scope.reactedTo == null){
				$scope.reactedTo = {'urls': []};
			}
			$scope.reactedTo.urls.push($scope.success.url);
			localStorage.setItem('feedback', JSON.stringify($scope.reactedTo));
		}, function(error){
			//Do nothing, popup will show up again next time
		});
	}

	$scope.dismissReaction = function(){
		$scope.step = 0;
		$scope.success = null;
		$scope.feedbackAvailableForThisPage = true;
	}

	//Fetch localStorage, and find if there's any feedback available for this page
	var validatePage = function(){
		if($scope.reactedTo !== null && $scope.reactedTo.urls.indexOf($location.url()) !== -1){
			$scope.feedbackAvailableForThisPage = true;
		}else{
			$scope.feedbackAvailableForThisPage = false;	
		}
	}

	//Re-validate page on page navigation
	$rootScope.$on('$locationChangeStart', function(event, toState, toParams, fromState, fromParams){ 
		$scope.reactedTo = JSON.parse(localStorage.getItem('feedback'));
    	validatePage();
	});

	//Just..validate the page
    validatePage();
}]);