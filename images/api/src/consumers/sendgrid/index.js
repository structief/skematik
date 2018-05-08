// Load the emitter, this one contains all the events
const emitter = require('../../helpers/emitter.js');
const Mail = require("./classes/SendGrid.js");
const config = require('./config.js');

// Subscribe to certain events.
// Best to document them properly
emitter.on(config.type + '.subscription.added', function(data){
	//Check origin for url
	switch(data.origin){
		case "http://localhost":
		case "https://www.skematik.io":
			break;
		default:
			data.origin = "https://www.skematik.io";
			break;
	}
	data = data.eventData;

	//Load shifts into <ul>
	var shifts = "";
	for(var i = 0; i < data.participations.length; i++){
		shifts += "<li>" + data.participations[i].row + " <i>" + data.participations[i].col + "</i></li>";
	}

	//Create mail
	var mail = new Mail();
	mail.templateId = config.subscriptionTemplateId;
	mail.recipients = [data.participant];
	mail.subject = "Bevestig jouw inschrijving op Skematik";
	mail.text = "Bevestig jouw inschrijving voor " + data.scheme.title + " op Skematik";
	mail.body = "Leuk dat je wil meewerken, ga ervoor!";
	mail.substitutions = {
		previewText: mail.text,
		firstname: "daar",
		schemeName: data.scheme.title,
		shifts: shifts,
		buttonName: "Confirm subscription",
		buttonUrl: data.origin + "/confirm/" + data.confirmToken
	};

	mail.send().then(function(response){
		if(response === true){
			//Do nothing, this is good.
		}else{
			console.error("Stuff did not do what we asked", response);
		}
	}).catch(function(error){
		console.log(error);
	});
});

emitter.on(config.type + '.subscription.confirmed', function(data){
	data = data.eventData;

	//Load shifts into <ul>
	var shifts = "";
	for(var i = 0; i < data.participations.length; i++){
		shifts += "<li>" + data.participations[i].row + " <i>" + data.participations[i].col + "</i></li>";
	}

	//Create mail
	var mail = new Mail();
	mail.templateId = config.confirmationTemplateId;
	mail.recipients = [data.participant];
	mail.subject = "Inschrijving bevestigd op Skematik";
	mail.text = "Inschrijving voor " + data.scheme.title + " bevestigd op Skematik";
	mail.body = "Bedankt voor jouw bevesting, da's in orde!";
	mail.substitutions = {
		previewText: mail.text,
		schemeName: data.scheme.title,
		firstname: "daar",
		shifts: shifts
	};

	mail.send().then(function(response){
		if(response === true){
			//Do nothing, this is good.
		}else{
			console.error("Stuff did not do what we asked", response);
		}
	}).catch(function(error){
		console.log(error);
	});
});

//Send a registered user an e-mail
emitter.on(config.type + '.register', function(data){
	//Create mail
	var mail = new Mail();
	mail.templateId = config.registerTemplateId;
	mail.recipients = [data[0].mail];
	mail.subject = "Welkom bij Skematik";
	mail.text = "Bevestiging account registratie op Skematik";
	mail.body = "Bevestiging account registratie op Skematik";
	mail.substitutions = {
		previewText: mail.text,
		firstname: data[0].given_name,
		buttonName: "Naar jouw dashboard",
		buttonUrl: "https://www.skematik.io/login"
	};

	mail.send().then(function(response){
		if(response === true){
			//Do nothing, this is good.
		}else{
			console.error("Stuff did not do what we asked", response);
		}
	}).catch(function(error){
		console.log(error);
	});
})
