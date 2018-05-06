// Load the emitter, this one contains all the events
const emitter = require('../../helpers/emitter.js');
const config = require('./config.js');

// Subscribe to certain events.
// Best to document them properly
emitter.on(config.type + '.subscription.added', function(data){
  console.log('emitting')
});
