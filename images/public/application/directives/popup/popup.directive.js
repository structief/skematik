skematikDirectives.directive('skematikPopup', ["$rootScope", "SchemeFactory", function($rootScope, SchemeFactory) {
	return {
		link: function(scope, element, attr) {
		},
		restrict: 'AEC',
		scope: {},
		templateUrl: 'application/directives/popup/popup.template.html',
		controller: 'PopupController'
	};
}]);