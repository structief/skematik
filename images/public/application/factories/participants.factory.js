//Participants factory
skematikFactories.factory('ParticipantsFactory',["$resource", "$location", function($resource, $location) {
  return $resource($location.protocol() + '://api.' + $location.host() + '/participants/:uuid/:type', {uuid: "@uuid"}, {
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