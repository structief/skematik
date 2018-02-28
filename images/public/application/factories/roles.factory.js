//Roles factory
skematikFactories.factory('RolesFactory',["$resource", "$location", function($resource, $location) {
  var host = $location.host();
  return $resource('http://' + host + ':3000/roles/', {}, {
  	//Gets all roles for this organisation
    get: {
      method: 'GET',
      isArray: true
    },
    //Creates a role
    create: {
    	method: 'POST'
    },
    //Updates a role
    update: {
    	method: 'PUT'
    },
    //Deletes a role
    delete: {
    	method: 'DELETE'
    }
  });
}]);