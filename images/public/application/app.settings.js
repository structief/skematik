//Initiate all config settings!
var base_url = "application/components/";

skematik.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {

	$locationProvider.html5Mode(true).hashPrefix('!');
  	$urlRouterProvider.otherwise( function($injector, $location) {
        var $state = $injector.get("$state");
        $state.go("fe.landing");
    });

	// Now set up the states
	$stateProvider
	.state('fe', {
		url: '',
		views: {
			"navigation":{
				templateUrl: base_url + "../core/header/headerView.html",
				controller: "HeaderController"
			}
		}
	})
	.state('fe.landing', {
		url: "/",
		views: {
			"pageContent@": {
				templateUrl: base_url + "landing/landingView.html",
				controller: "LandingController",
			}
		}
	})
	.state('fe.entry', {
		url: "/",
		views: {
			"pageContent@": {
				templateUrl: base_url + "entry/entryView.html",
				controller: "EntryController",
			}
		}
	});
}]);

skematik.run(["$rootScope", "$state", "$stateParams", function($rootScope, $state, $stateParams){	
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    	//End loading screen
    	console.log("View loaded");
    });
}]);