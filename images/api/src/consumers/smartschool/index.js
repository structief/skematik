// Load the emitter, this one contains all the events
const emitter = require('../../helpers/emitter.js');
// Base event listener
const base_type = "smartschool";

// Subscribe to certain events.
// Best to document them properly
emitter.on(base_type + '.subscription.added', function(data){
  console.log('emitting')
});
