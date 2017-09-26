skematikDirectives.directive('skematikAlert', ["$rootScope", function($rootScope) {
	return {
		link: function(scope, element, attr) {
		},
		restrict: 'AEC',
		scope: {},
		templateUrl: 'application/directives/alert/alert.template.html',
		controller: 'AlertController'
	};
}]);