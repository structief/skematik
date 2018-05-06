// Load the emitter, this one contains all the events
const emitter = require('../../helpers/emitter.js');
const Mail = require("./classes/SendGrid.js");
const config = require('./config.js');

// Subscribe to certain events.
// Best to document them properly
emitter.on(config.type + '.subscription.added', function(data){
	var mail = new Mail();
	mail.template_id(subscriptionTemplateId);
	mail.recipients = [data.insert[0].participant];
	mail.subject = "Bevestig jouw inschrijving op Skematik";
	mail.text = "Preview text voor mailclients";
	mail.body = "Yay, fijn dat je mee wil werken, go for it!";
	mail.substitutions = {
		previewText: mail.text,
		body: mail.body,
		title: "Require some lines",
		firstname: "Franklin",
		buttonName: "Confirm subscription",
		buttonUrl: `http://localhost/confirm/${data.insert[0].confirm_token}`
	};

	var response = mail.send();
	if(response === true){
		console.log("Yay");
	}else{
		console.error("Stuff did not do what we asked", response);
	}
});

emitter.on(config.type + '.subscription.confirmed', function(data){
	console.log(data);
})
