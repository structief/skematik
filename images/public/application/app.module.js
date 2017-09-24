//initiate ALL controllers, directives and factories!
var skematikControllers = angular.module('skematik.controllers', []);
var skematikDirectives = angular.module('skematik.directives', []);
var skematikFactories = angular.module('skematik.factories', []);

var skematikApp = angular.module('skematik', [
    skematikControllers,
    skematikDirectives,
    skematikFactories
]);

