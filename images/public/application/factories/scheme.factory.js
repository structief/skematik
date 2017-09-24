//Scheme factory
skematikFactories.factory('SchemeFactory',["$resource", function($resource) {
  return $resource('/scheme/:uuid', {uuid: "@uuid"}, {
    get: {
      method: 'GET',
      isArray: false,
        interceptor: {
            response: function(response) {      
                var result = response.resource;        
                result.$status = response.status;
                return result;
            }
        }
    }
  });
}]);