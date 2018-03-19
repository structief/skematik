skematikFactories.factory('resourceInterceptor', ["$rootScope", "$q", function ($rootScope, $q) {
  return {
    request: function (config) {
      //Intercept all calls to api
      if(system.logApi){
        if(config.url.indexOf(":3000") !== -1){
          console.log("Started loading: " + config.url);
        }
      }

      //Start progressbar
      $rootScope.$broadcast("progressbar.start", {});
      
      //Return config
      return config;
    },
    response: function (response) {
      //Intercept all calls to api
      if(response.config.url.indexOf(":3000") !== -1){
        if(system.logApi){
          console.log("Done loading: " + response.config.url + " with code: " + response.status + ":" + response.statusText);
        }
        response.data.$status = response.status;
      }
      
      //End progressbar
      $rootScope.$broadcast("progressbar.complete", {});

      //Return response
      return response;
    },
    responseError: function (error) {
      $rootScope.$broadcast("request.error", {error: error});

      //Set status
      if(error.data == null){
        error.data = {};
      }
      error.data.$status = error.status;

      //End progressbar
      $rootScope.$broadcast("progressbar.complete", {});

      return $q.reject(error);
    }
  };
}]);

