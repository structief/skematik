//Initiate all config settings!
var base_url = "application/components/";

skematik.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", "jwtOptionsProvider", function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, jwtOptionsProvider) {
	// Crazy prefixes
	$locationProvider.html5Mode(true).hashPrefix('!');

	// Now set up the states
	$stateProvider
	.state('fe', {
		url: '',
		views: {
			"header": {
				templateUrl: base_url + "../core/header/header.view.html",
				controller: "HeaderController"
			},
			"footer": {
				templateUrl: base_url + "../core/footer/footer.view.html",
				controller: "FooterController"
			}
		},
		data: {
			requiresLogin: false
		}
	})
	.state('fe.landing', {
		url: "/",
		views: {
			"pageContent@": {
				templateUrl: base_url + "frontend/landing/landing.view.html",
				controller: "LandingController",
			}
		}
	})
	.state('fe.scheme', {
		url: "/id/:tableId",
		views: {
			"pageContent@": {
				templateUrl: base_url + "frontend/scheme/scheme.view.html",
				controller: "SchemeController",
			}
		}
	})
	.state('fe.entry', {
		url: "/entry",
		views: {
			"pageContent@": {
				templateUrl: base_url + "frontend/entry/entry.view.html",
				controller: "EntryController",
			}
		}
	})
	.state('fe.page', {
		url: "/:slug",
		views: {
			"pageContent@": {
				templateUrl: base_url + "frontend/page/page.view.html",
				controller: "PageController",
			}
		}
	})
	.state('be.login', {
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
			"header":{
				templateUrl: base_url + "../core/header/header.view.html",
				controller: "HeaderController"
			},
			"footer": {
				templateUrl: base_url + "../core/footer/footer.view.html",
				controller: "FooterController"
			}
		},
		data: {
			requiresLogin: true
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
		url: "/scheme/:schemeUuid",
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

	//Add config for jwt
	jwtOptionsProvider.config({
		tokenGetter: ['options', function(options) {
			// Skip authentication for any requests ending in .html
	        if (options && options.url.substr(options.url.length - 5) == '.html') {
	          return null;
	        }
	        return localStorage.getItem('jwt-token');
		}],
		whiteListedDomains: ['api.skematik.io', 'localhost'],
		unauthenticatedRedirectPath: '/admin/login'
    });


	//Push interceptors for HTTP calls
    $httpProvider.interceptors.push('resourceInterceptor');
   // $httpProvider.interceptors.push('jwtInterceptor');
}]);

skematik.run(["$rootScope", "$state", "$stateParams", "authManager", "AccountFactory", function($rootScope, $stateProvider, $stateParams, authManager, AccountFactory){	
	//Account check
	AccountFactory.isLoggedIn();
	
	//Check authentication on refresh and redirect to login if necessary
    authManager.checkAuthOnRefresh();
    authManager.redirectWhenUnauthenticated();


    //On login, redirect automatically to /dashboard
    $rootScope.$on("account.login", function(data){
    	console.log("User logged in");
    	console.info(data);
		$stateProvider.go('be.dashboard');
		$rootScope.isAuthenticated = true;
    });

    //On logout, redirect automatically to homepage
    $rootScope.$on("account.logout", function(data){
		$stateProvider.go('fe.entry');
    	console.log("User logged out");
    	console.info(data);
        $rootScope.isAuthenticated = false;
    });
}]);