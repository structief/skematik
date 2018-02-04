skematikDirectives.directive('skematikSidebar', ["$rootScope", function($rootScope) {
	return {
		link: function(scope, element, attr) {
		},
		restrict: 'AEC',
		transclude: true,
		scope: {
			position: '@',
			title: '@',
			uuid: '@'
		},
		templateUrl: 'application/directives/sidebar/sidebar.template.html',
		controller: 'SidebarController'
	};
}]);