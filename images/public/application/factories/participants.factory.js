//Participants factory
skematikFactories.factory('ParticipantsFactory',["$resource", "$location", function($resource, $location) {
  var host = $location.host();
  return $resource('http://' + host + ':3000/participants/:uuid/:type', {uuid: "@uuid"}, {
  	//Gets all participants for this organisation
    get: {
      method: 'GET',
      isArray: true
    },
    //Creates a participant
    create: {
    	method: 'POST'
    },
    //Updates a participant
    update: {
    	method: 'PUT'
    },
    //Deletes a participant
    delete: {
    	method: 'DELETE'
    }
  });
}]);