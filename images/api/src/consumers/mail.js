// Load the emitter, this one contains all the events
var emitter = require('../helpers/emitter.js');
const base_type = "mail";

// Subscribe to certain events.
// Best to document them properly
emitter.on(base_type + '.subscription.added', function(data){
  console.log('A new subscription!');
  console.log(data);
});
