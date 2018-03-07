'use strict';


const App = require('./App');

//return new App().start();

//Testing purposes, don't forget to remove!
const consumers = './src/consumers/';
const emitter = require('./src/helpers/emitter.js');
const fs = require('fs');

//Load consumers
fs.readdirSync(consumers).forEach(file => {
  require(consumers + file);
});