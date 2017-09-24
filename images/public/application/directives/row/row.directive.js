skematikDirectives.directive('skematikRow', function() {
	return {
		link: function(scope, element, attr) {
			console.log(scope.row);
		},
		restrict: 'AEC',
		scope: {
			row: '=',
		},
		templateUrl: 'application/directives/row/row.template.html'
	};
});