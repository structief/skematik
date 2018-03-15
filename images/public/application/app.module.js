//initiate ALL controllers, directives and factories!
var skematikControllers = angular.module('skematik.controllers', []);
var skematikDirectives = angular.module('skematik.directives', []);
var skematikFactories = angular.module('skematik.factories', []);

var skematik = angular.module('skematik', [
    'skematik.controllers',
    'skematik.directives',
    'skematik.factories',
    'ui.router',
    'ngResource',
    'ngSanitize',
    'angular-jwt',
    'cfp.hotkeys',
    'ngProgress'
]);
