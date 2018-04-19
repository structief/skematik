// Load the emitter, this one contains all the events
const emitter = require('../../helpers/emitter.js');
const Mail = require("./classes/SendGrid.js");
// Base event listener
const base_type = "mail";

// Subscribe to certain events.
// Best to document them properly
emitter.on(base_type + '.subscription.added', function(data){
	var mail = new Mail();
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
		buttonUrl: `http://localhost:3000/confirm/${data.insert[0].confirm_token}`
	};

	var response = mail.send();
	if(response === true){
		console.log("Yay");
	}else{
		console.error("stuff did not do what we asked", response);
	}
});
