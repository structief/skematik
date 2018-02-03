//Participants factory
skematikFactories.factory('ParticipantsFactory',["$resource", "$location", function($resource, $location) {
  var host = $location.host();
  return $resource('http://' + host + ':3000/users/:uuid/:type', {uuid: "@uuid"}, {
    get: {
      method: 'GET',
      isArray: true
    }
  });
}]);