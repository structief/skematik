// Load the emitter, this one contains all the events
const emitter = require('../../helpers/emitter.js');
const Mail = require("./classes/SendGrid.js");
const config = require('./config.js');

// Subscribe to certain events.
// Best to document them properly
emitter.on(config.type + '.subscription.added', function(data){
	//Load shifts into <ul>
	const shifts = "";
	for(var i = 0; i < data.participations.length; i++){
		shifts += "<li>" + data.participations[i].row + " <i>" + data.participations[i].col + "</i></li>";
	}

	//Create mail
	var mail = new Mail();
	mail.template_id(subscriptionTemplateId);
	mail.recipients = [data.insert[0].participant];
	mail.subject = "Bevestig jouw inschrijving op Skematik";
	mail.text = "Bevestig jouw inschrijving voor " + data.scheme.title + " op Skematik";
	mail.body = "Leuk dat je wil meewerken, ga ervoor!";
	mail.substitutions = {
		previewText: mail.text,
		firstname: "daar",
		schemeName: data.scheme.title,
		shifts: shifts,
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
	//Load shifts into <ul>
	const shifts = "";
	for(var i = 0; i < data.participations.length; i++){
		shifts += "<li>" + data.participations[i].row + " <i>" + data.participations[i].col + "</i></li>";
	}

	//Create mail
	var mail = new Mail();
	mail.template_id(confirmationTemplateId);
	mail.recipients = [data.participant];
	mail.subject = "Inschrijving bevestigd op Skematik";
	mail.text = "Inschrijving voor " + data.scheme.title + " bevestigd op Skematik";
	mail.substitutions = {
		previewText: mail.text,
		schemeName: data.scheme.title
		firstname: "daar",
		shifts: shifts
	};

	var response = mail.send();
	console.log(response);
	if(response === true){
		console.log("Yay");
	}else{
		console.error("Stuff did not do what we asked", response);
	}
})
