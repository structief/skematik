//Initiate all config settings!
var base_url = "application/components/";

skematik.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
	// Crazy prefixes
	$locationProvider.html5Mode(true).hashPrefix('!');

	// Now set up the states
	$stateProvider
	.state('fe', {
		url: '',
		views: {
			"navigation":{
				templateUrl: base_url + "../core/header/header.view.html",
				controller: "HeaderController"
			}
		}
	})
	.state('fe.scheme', {
		url: "/id/:tableId",
		views: {
			"pageContent@": {
				templateUrl: base_url + "scheme/scheme.view.html",
				controller: "SchemeController",
			}
		}
	})
	.state('fe.entry', {
		url: "/",
		views: {
			"pageContent@": {
				templateUrl: base_url + "entry/entry.view.html",
				controller: "EntryController",
			}
		}
	})
	.state('fe.login', {
		url: "/login",
		views: {
			"pageContent@": {
				templateUrl: base_url + "backend/login/login.view.html",
				controller: "BeLoginController",
			}
		}
	})
	.state('be', {
		url: '/admin',
		views: {
			"navigation":{
				templateUrl: base_url + "../core/header/header.view.html",
				controller: "HeaderController"
			}
		}
	})
	.state('be.dashboard', {
		url: "/dashboard",
		views: {
			"pageContent@": {
				templateUrl: base_url + "backend/dashboard/dashboard.view.html",
				controller: "BeDashboardController",
			}
		}
	})
	.state('be.users', {
		url: "/users",
		views: {
			"pageContent@": {
				templateUrl: base_url + "backend/users/users.view.html",
				controller: "BeUsersController",
			}
		}
	})
	.state('be.scheme', {
		url: "/scheme/:schemeId",
		views: {
			"pageContent@": {
				templateUrl: base_url + "backend/scheme/scheme.view.html",
				controller: "BeSchemeController",
			}
		}
	})
	.state('be.account', {
		url: "/account",
		views: {
			"pageContent@": {
				templateUrl: base_url + "backend/account/account.view.html",
				controller: "BeAccountController",
			}
		}
	});

    $httpProvider.interceptors.push('resourceInterceptor');
}]);

skematik.run(["$rootScope", "$state", "$stateParams", function($rootScope, $state, $stateParams){	
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    	//End loading screen
    	console.log("View loaded");
    });
}]);