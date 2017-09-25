//Scheme factory
skematikFactories.factory('SchemeFactory',["$resource", function($resource) {
  return $resource('http://localhost:3000/schema/:uuid/:type', {uuid: "@uuid"}, {
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
    },
    participate: {
      method: 'POST',
      isArray: true,
      params: {
        type: "answer"
      },
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