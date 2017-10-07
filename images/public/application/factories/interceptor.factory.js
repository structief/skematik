skematikFactories.factory('resourceInterceptor', ["$rootScope", function ($rootScope) {
  return {
    request: function (config) {
      $rootScope.$broadcast("request.loading", {config: config});

      //Return config
      return config;
    },
    response: function (response) {
      $rootScope.$broadcast("request.done", {response: response});

      //Return response
      return response;
    },
    responseError: function (error) {
      $rootScope.$broadcast("request.error", {error: error});
    }
  };
}]);

