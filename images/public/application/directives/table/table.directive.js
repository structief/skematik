skematikDirectives.directive('skematikTable', ["SchemeFactory", function(SchemeFactory) {
	return {
		link: function(scope, element, attr) {
			scope.scheme = {
				uuid: scope.uuid
			};

			//Fake data
			scope.scheme = JSON.parse('{ "uuid": "a3cbeb60-a12d-11e7-bcdf-0751b7809adf", "title": "Testing new hourly schema", "headers": ["12 uur", "13 uur", "14 uur"], "created_at": "2017-09-24T13:37:34.993Z", "updated_at": "2017-09-24T13:37:34.993Z", "rows": [ { "name": "bar", "cells": [ { "max": 2, "current": 0, "col": "12 uur", "uuid": "a3cbeb60-a12d-11e7-bcdf-0751b7809adf" }, { "max": 1, "current": 0, "col": "13 uur", "uuid": "c48c2a90-a12d-11e7-bcdf-0751b7809adf" }, { "max": 1, "current": 0, "col": "14 uur", "uuid": "c8436630-a12d-11e7-bcdf-0751b7809adf" } ] }, { "name": "afwas", "cells": [ { "max": 4, "current": 0, "col": "12 uur", "uuid": "a3cd7200-a12d-11e7-bcdf-0751b7809adf" }, { "max": 2, "current": 0, "col": "13 uur", "uuid": "c48d6310-a12d-11e7-bcdf-0751b7809adf" }, { "max": 2, "current": 0, "col": "14 uur", "uuid": "c8449eb0-a12d-11e7-bcdf-0751b7809adf" } ] }, { "name": "zaal", "cells": [ { "max": 1, "current": 0, "col": "12 uur", "uuid": "a3ccfcd0-a12d-11e7-bcdf-0751b7809adf" }, { "max": 4, "current": 0, "col": "13 uur", "uuid": "c48d14f0-a12d-11e7-bcdf-0751b7809adf" }, { "max": 4, "current": 0, "col": "14 uur", "uuid": "c84477a0-a12d-11e7-bcdf-0751b7809adf" } ] } ] }');
			/*SchemeFactory.get({uuid: scope.scheme.uuid}, function(response){
				if(response.$status == 404){
					//Scheme not found
					$stateProvider.go('fe.entry', {error: "Scheme not found"});
				}else{
					//All is fine
					scope.scheme = response;
				}
			});*/
		},
		restrict: 'AEC',
		scope: {
			uuid: '='
		},
		templateUrl: 'application/directives/table/table.template.html',
		controller: 'TableController',
	};

}]);