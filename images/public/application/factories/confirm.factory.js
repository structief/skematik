//Confirm factory
skematikFactories.factory('ConfirmFactory',["$resource", "$location", function($resource, $location) {
  return $resource($location.protocol() + '://api.' + $location.host().replace("www.", "") + '/confirm/:token', {token: "@token"}, {
  	//Confirm certain subscriptions based on token
    get: {
      method: 'GET',
      isArray: false
    }
  });
}]);