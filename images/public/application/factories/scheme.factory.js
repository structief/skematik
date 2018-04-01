//Scheme factory
skematikFactories.factory('SchemeFactory',["$resource", "$location", function($resource, $location) {
  return $resource($location.protocol() + '://api.' + $location.host().replace("www.", "") + '/schema/:uuid/:type', {uuid: "@uuid"}, {
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
      isArray: false,
      params: {
        type: "answer"
      },
      skipAuthorization: true
    },
    update: {
      method: 'PUT',
      isArray: false
    },
    create: {
      method: 'POST',
      isArray: false
    }
  });
}]);