 // Not much to this, right?
const EventEmitter = require('events');

class Dispatch extends EventEmitter {}
const emitter = new Dispatch();

module.exports = emitter;