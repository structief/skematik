skematikDirectives.directive('skematikTable', ["$rootScope", "SchemeFactory", function($rootScope, SchemeFactory) {
	return {
		link: function(scope, element, attr) {
		},
		restrict: 'AEC',
		scope: {
			uuid: '=',
			role: '@'
		},
		templateUrl: 'application/directives/table/table.template.html',
		controller: 'TableController'
	};
}]);