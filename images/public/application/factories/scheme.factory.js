//Scheme factory
skematikFactories.factory('SchemeFactory',["$resource", "$location", function($resource, $location) {
  var host = $location.host();
  return $resource('http://' + host + ':3000/schema/:uuid/:type', {uuid: "@uuid"}, {
    get: {
      method: 'GET',
      isArray: true
    },
    getOne: {
      method: 'GET',
      isArray: false,
      skipAuthorization: true
    },
    participate: {
      method: 'POST',
      isArray: true,
      params: {
        type: "answer"
      },
      skipAuthorization: true
    }
  });
}]);