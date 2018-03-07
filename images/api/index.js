'use strict';


const App = require('./App');

//return new App().start();

const fs = require('fs');
fs.readdirSync("./src/consumers/").forEach(consumer => {
	if(consumer.indexOf(".DS_Store") == -1 ){
  		require("./src/consumers/" + consumer + "/index.js");
  	}
});


