// Load the emitter, this one contains all the events
var emitter = require('../helpers/emitter.js');

// Subscribe to certain events.
// Best to document them properly
emitter.on('server.start', function(data){
  console.log('The server has started!');
});
