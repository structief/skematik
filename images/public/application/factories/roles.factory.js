//Roles factory
skematikFactories.factory('RolesFactory',["$resource", "$location", function($resource, $location) {
  return $resource($location.protocol() + '://api.' + $location.host() + '/roles/', {}, {
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