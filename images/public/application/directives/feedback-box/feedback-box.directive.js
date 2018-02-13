skematikDirectives.directive('skematikFeedbackBox', ["$rootScope", function($rootScope) {
	return {
		link: function(scope, element, attr) {
		},
		restrict: 'AEC',
		scope: {},
		templateUrl: 'application/directives/feedback-box/feedback-box.template.html',
		controller: 'FeedbackBoxController'
	};
}]);