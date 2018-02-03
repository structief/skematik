skematikFactories.factory('resourceInterceptor', ["$rootScope", function ($rootScope) {
  return {
    request: function (config) {
      //Intercept all calls to api
      if(config.url.startsWith("http://localhost:3000/")){
        console.log("Started loading: " + config.url);
      }

      //Return config
      return config;
    },
    response: function (response) {
      //Intercept all calls to api
      if(response.config.url.startsWith("http://localhost:3000/")){
        console.log("Done loading: " + response.config.url + " with code: " + response.status + ":" + response.statusText);
        response.data.$status = response.status;
      }

      //Return response
      return response;
    },
    responseError: function (error) {
      $rootScope.$broadcast("request.error", {error: error});

      return error;
    }
  };
}]);

