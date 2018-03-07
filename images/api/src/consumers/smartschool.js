// Load the emitter, this one contains all the events
const emitter = require('../helpers/emitter.js');
var soap = require('soap');
var parser = require('xml2json');

// Configuration
var url = 'https://sintguido.smartschool.be/Webservices/V3?wsdl';

// This shouldn't be in any commit, but hey, it is now. Let's replace it later on ¯\_(ツ)_/¯
var pswds = {
	'getAllAccounts': '4168af95eb0b7ee2bacc',
	'sendMsg': '937085f2c099a1dbf9d3',
	'getAllGroupsAndClasses': '8dea6f880425ee81f7d4'
};

// Subscribe to certain events.
// Best to document them properly
emitter.on('smartschool.getAllAccounts', function(data){
	soap.createClient(url, function(err, client) {
	  	var payload = {
	  		"accesscode": pswds.getAllAccounts,
	  		"code": "Beheerders", //Call "Iedereen" is too long
	  		"recursive": 0
	  	};
    	client.getAllAccounts(payload, function(err, result) {
			if(err){
				console.log("Error:");
				console.log(err.body);
			}else{
				/*
				 * :facepalm:
				 * This sh*t replied with a BASE64-encoded string, ànd in xml. Yay
				*/
				console.log("Result");
				console.log(parser.toJson(Buffer.from(result.return['$value'], 'base64').toString('ascii')));
			}
		});
	});
});

//Send Message
/*
 * This function works, but needs some rework:
 * - replace inline html with template or something
 * - read "userIdentifier" out of data, not inline
 * - needs better error- and succes-handling
*/
emitter.on('smartschool.sendMsg', function(data){
	soap.createClient(url, function(err, client) {
	    client.sendMsg({
	    	"accesscode": pswds.sendMsg,
	    	"userIdentifier": "geert.everaert",
	    	"title": "Skematik - verzonden door Koen",
	    	"body": '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns:v="urn:schemas-microsoft-com:vml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;" /> <meta name="viewport" content="width=600,initial-scale = 2.3,user-scalable=no"> <!--[if !mso]><!-- --> <link rel=\'stylesheet\' id=\'fonts-style-css\' href=\'http://fonts.googleapis.com/css?family=Raleway:300,400,500\' type=\'text/css\' media=\'all\' /> <!--<![endif]--> <title>Skematik - Mailing</title> <style type="text/css"> body { width: 100%; background-color: #f9f9f9; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; mso-margin-top-alt: 0px; mso-margin-bottom-alt: 0px; mso-padding-alt: 0px 0px 0px 0px; font-family: Raleway; } p, h1, h2, h3, h4 { margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; } span.preheader { display: none; font-size: 1px; } html { width: 100%; } table { font-size: 14px; border: 0; } button, .button{ color: #ffffff; display: inline-block; height: 38px; padding: 0 3rem; text-align: center; font-size: 11px; font-family: sans-serif; font-weight: 600; line-height: 38px; letter-spacing: .1rem; text-transform: uppercase; text-decoration: none; white-space: nowrap; background-color: transparent; cursor: pointer; box-sizing: border-box; } /* ----------- responsivity ----------- */ @media only screen and (max-width: 640px) { /*------ top header ------ */ .main-header { font-size: 20px !important; } .main-section-header { font-size: 28px !important; } .show { display: block !important; } .hide { display: none !important; } .align-center { text-align: center !important; } .no-bg { background: none !important; } /*----- main image -------*/ .main-image img { width: 440px !important; height: auto !important; } /* ====== divider ====== */ .divider img { width: 440px !important; } /*-------- container --------*/ .container590 { width: 440px !important; } .container580 { width: 400px !important; } .main-button { width: 220px !important; } /*-------- secions ----------*/ .section-img img { width: 320px !important; height: auto !important; } .team-img img { width: 100% !important; height: auto !important; } } @media only screen and (max-width: 479px) { /*------ top header ------ */ .main-header { font-size: 18px !important; } .main-section-header { font-size: 26px !important; } /* ====== divider ====== */ .divider img { width: 280px !important; } /*-------- container --------*/ .container590 { width: 280px !important; } .container590 { width: 280px !important; } .container580 { width: 260px !important; } /*-------- secions ----------*/ .section-img img { width: 280px !important; height: auto !important; } .sideBar{ display: none; } } </style> <!--[if gte mso 9]><style type=text/css> body { font-family: arial, sans-serif!important; } </style> <![endif]--> </head> <body class="respond" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"> <!-- pre-header --> <table style="display:none!important;"> <tr> <td> <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;"> {{previewText}} </div> </td> </tr> </table> <!-- pre-header end --> <!-- header --> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" style="border-top: 1px solid #eee;border-bottom: 1px solid #eee;margin-bottom: 20px;"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td align="center" height="60" style="height:60px;"> <a href="" style="display: block; border-style: none !important; border: 0 !important;text-decoration: none;position: relative;"> <img width="40" border="0" style="display: inline-block; width: 40px;margin-left: -80px" src="https://icongr.am/feather/minus-square.svg?color=33c3f0" alt="" /> <span style="display: inline-block;margin: 11px 0px 0px 10px;color: #333333;position: absolute;font-size:15px">Skematik</span> </a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <!-- end header --> <!-- big image section --> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="f9f9f9" class="bg_color"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td align="center" style="color: #333333; font-size: 24px; font-family: Raleway; font-weight:500; line-height: 35px;" class="main-header"> <!-- section text ======--> <div style="line-height: 35px">{{title}}</div> </td> </tr> <tr> <td height="10" style="font-size: 10px; line-height: 10px;"> </td> </tr> <tr> <td height="20" style="font-size: 20px; line-height: 20px;"> </td> </tr> <tr> <td align="left"> <table border="0" width="590" align="center" cellpadding="0" cellspacing="0" class="container590"> <tr> <td align="left" style="color: #888888; font-size: 16px; font-family: \'Lato\'; line-height: 24px;font-weight: 500"> <!-- section text ======--> <p style="line-height: 24px; margin-bottom:15px;"> Hey {{firstname}} </p> {{body}} <table border="0" align="center" width="180" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"> <tr> <td height="10" style="font-size: 10px; line-height: 10px;"> </td> </tr> <tr> <td align="center"> <!-- main section button --> <div style="background-color: #33c3f0; border-radius: 4px;font-size: 11px"> <a href="{{buttonUrl}}" class="button" >{{buttonName}}</a> </div> </td> </tr> <tr> <td height="10" style="font-size: 10px; line-height: 10px;"> </td> </tr> </table> <p style="line-height: 24px"> Liefs,</br> Het Skematik team </p> </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr> <td height="40" style="font-size: 40px; line-height: 40px;"> </td> </tr> </table> <!-- end section --> <!-- contact section --> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color"> <tr> <td height="60" style="font-size: 60px; line-height: 60px;"> </td> </tr> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590 bg_color"> <tr> <td> <table border="0" width="300" align="left" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="container590"> <tr> <!-- logo --> <td align="left"> <a href="" style="display: block; border-style: none !important; border: 0 !important;text-decoration: none;position: relative;margin-left: 75px"> <img width="40" border="0" style="display: inline-block; width: 40px;margin-left: -80px" src="https://icongr.am/feather/minus-square.svg?color=33c3f0" alt="" /> <span style="display: inline-block;margin: 11px 0px 0px 10px;color: #333333;position: absolute;font-size:15px;font-family: Raleway;font-weight: 300">Skematik</span> </a> </td> </tr> <tr> <td height="25" style="font-size: 25px; line-height: 25px;"> </td> </tr> <tr> <td align="left" style="color: #999999; font-size: 13px; font-family: \'Raleway\'; font-weight: 500;line-height: 21px" class="text_color"> <p> Skematik is gebouwd als een Minimum-Lovable-Product, dus 2 dingen goed onthouden: Ten eerste zitten er misschien nog wat bugs in, en tweede: \'t is met liefde gemaakt. *Drops mic* </p> </td> </tr> </table> </td> <td class="sideBar"> <table border="0" align="right" cellpadding="0" cellspacing="0"> <tr> <td height="40" style="height: 40px"> <div style="font-weight: Raleway; font-size: 13px; line-height: 21px;text-transform: uppercase;color: #999999;font-weight: 500">Skematik</div> </td> </tr> <tr> <td height="25" style="height: 25px;font-family: Raleway; font-size: 13px; color: #333333"> <a href style="color: #333333;text-decoration: none">Home</a> </td> </tr> <tr> <td height="25" style="height: 25px;font-family: Raleway; font-size: 13px; color: #333333"> <a href style="color: #333333;text-decoration: none">Features</a> </td> </tr> <tr> <td height="25" style="height: 25px;font-family: Raleway; font-size: 13px; color: #333333"> <a href style="color: #333333;text-decoration: none">Pricing</a> </td> </tr> <tr> <td height="25" style="height: 25px;font-family: Raleway; font-size: 13px; color: #333333"> <a href style="color: #333333;text-decoration: none">Get started</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr> <td height="60" style="font-size: 60px; line-height: 60px;"> </td> </tr> </table> <!-- end section --> <!-- footer ======--> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="f9f9f9"> <tr> <td height="25" style="font-size: 25px; line-height: 25px;"> </td> </tr> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td> <table border="0" align="left" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="container590"> <tr> <td align="left" style="color: #aaaaaa; font-size: 12px; font-family: \'Raleway\'; line-height: 24px;"> <div style="line-height: 24px;"> <span style="color: #333333;">Geen fan van deze mail? Update jouw instellingen in <a href="#" style="color: #33c3f0;text-decoration: none">jouw profiel</a>.</span> </div> </td> </tr> </table> <table border="0" align="left" width="5" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="container590"> <tr> <td height="20" width="5" style="font-size: 20px; line-height: 20px;"> </td> </tr> </table> <table border="0" align="right" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="container590"> <tr> <td align="center"> <table align="center" border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center"> <a style="font-size: 14px; font-family: \'Raleway\'; line-height: 24px;color: #33c3f0; text-decoration: none;font-weight:300;font-size: 12px" href="{{UnsubscribeURL}}">hello@skematik.io</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr> <td height="25" style="font-size: 25px; line-height: 25px;"> </td> </tr> </table> <!-- end footer ======--> </body> </html>'
	    }, function(err, result){
			if(err){
	          	console.log("Error:");
	          	console.log(err.body);
	          }else{
	          	console.log("Result");
	          	console.log(result);
	          }
	    });
	});
});



/*
 * Stuur naar bepaalde gebruiker
$result = $client->sendMsg('webserviceswachtwoord','admin','Dit is een test', '<p>Dit is de body van het testbericht (html-formaat)</p>');

* Vraag alle accounts op
$result = $client->getAllAccounts('webserviceswachtwoord','Beheerders','0');

* Describe parameters for certian functionn
console.log(client.describe().V3Service.V3Port.getAllAccountsExtended);
*/

// This is just a reference for developing, but quite useful
var smartschoolErrorCodes = {
	"1":"De naam dient minimaal uit 2 karakters te bestaan.",
	"2":"De voornaam dient uit minimaal 2 karakters te bestaan.",
	"3":"De gebruikersnaam dient minimaal uit 2 karakters bestaan.",
	"4":"Het nieuwe wachtwoord is niet complex genoeg.<br>Het nieuwe wachtwoord dient minimaal 8 karakters lang te zijn en aan 3 van de 4 volgende voorwaarden voldoen:<br>- een uppercase letter bevatten (A-Z)<br>- een lowercase letter bevatten (a-z)<br>- een cijfer bevatten (0-9)<br>- een ander karakter bevatten (._-*!?\\/)",
	"5":"Er is geen groep geselecteerd.",
	"6":"De gebruikersnaam bestaat reeds.",
	"7":"De wachtwoorden zijn niet identiek.",
	"8":"Het opgegeven webserviceswachtwoord is niet correct.",
	"9":"Deze gebruiker bestaat niet",
	"10":"Er is een fout gebeurd tijdens het verwerken van de gegevens. Er is niets toegepast.",
	"11":"Er is een fout opgetreden tijdens het bewaren van de klasgegevens.",
	"12":"Deze gebruiker bestaat niet",
	"13":"Er is een fout opgetreden tijdens het kopiëren\\/verplaatsen van de gebruikers naar de opgegeven klas.",
	"14":"Onvoeldoende gegeven aangeleverd.",
	"15":"Dubbele gebruikersnaam",
	"16":"Dubbele interne nummer",
	"17":"Er is een fout opgetreden tijdens het bewaren van één of meerdere profielvelden.",
	"18":"Er is een fout opgetreden bij het versturen van het bericht",
	"19":"Parent-ID bestaat niet !",
	"20":"Cursus toevoegen mislukt.",
	"21":"Cursus met zelfde naam aanwezig.",
	"22":"Cursus niet gevonden.",
	"23":"Er is een onbekende fout opgetreden tijdens de verwerking.",
	"24":"Er is reeds een gebruiker aanwezig met dit intern nummer. Gelieve een ander nummer in te geven.",
	"25":"Opgelet, de gebruiker kon niet worden gewijzigd, omdat deze niet bestaat in Smartschool.",
	"26":"Opgelet, de gebruiker kon niet worden toegevoegd, omdat deze reeds bestaat in Smartschool.",
	"27":"Opgelet, het instellingsnummer komt niet voor in Smartschool. Gelieve eerst de instelling toe te voegen.",
	"28":"Het selecteren van een basisrol is verplicht.",
	"29":"U mag de basisrol van deze account niet meer wijzigen.",
	"30":"Enkel leerlingen (basisrol leerling) mogen lid zijn van officiële klassen.",
	"31":"De leerling mag maar lid zijn van één officiële klas.",
	"32":"Een leerling dient lid te zijn van één officiële klas.",
	"33":"Het registeren van de klasbeweging is mislukt.",
	"34":"De leerling kan niet geactiveerd worden omdat hij geen lid is van een officiële klas.",
	"35":"Het instellingsnummer is verplicht bij een officiële klas.",
	"36":"U mag het type van een officiële klas niet wijzigen.",
	"37":"U mag het type van deze klas of groep niet wijzigen omdat sommige leden van deze groep of klas niet de basisrol leerling hebben.",
	"38":"U mag het type van deze klas of groep niet wijzigen omdat sommige leden van deze groep of klas reeds lid zijn van een andere officiële klas.",
	"39":"U dient een vormingscomponent te selecteren.",
	"40":"U mag de naam van een klas niet meer wijzigen.",
	"41":"U mag het administratiefnummer niet meer wijzigen.",
	"42":"U mag het instellingsnummer niet meer wijzigen.",
	"43":"U mag de vormingscomponent niet meer wijzigen.",
	"44":"De vormingscomponent is verplicht op te geven.",
	"45":"U mag het type van een klas niet wijzigen.",
	"46":"U dient het type van de groep te selecteren.",
	"47":"Er bestaat reeds een klas met dezelfde unieke klas- of groepcode",
	"48":"Het intern nummer bestaat reeds.","49":"De datum is niet geldig",
	"50":"De module 'Skore' is niet geactiveerd",
	"51":"Er is een fout opgetreden tijdens het uitschrijven van de leerling",
	"52":"Dit wachtwoord werd niet toegestaan. Gelieve een ander wachtwoord te kiezen.",
	"53":"De bovenliggende groep werd niet gevonden.",
	"54":"De bovenliggende groep mag geen officiëe klas zijn.",
	"55":"Een officiële klas kan geen subgroepen bevatten.",
	"56":"Gelieve een geldige datum op te geven voor het schooljaar",
	"57":"Het \'Koppelingsveld schoolagenda\' dient uniek te zijn. De waarde die u invulde is reeds in gebruik."
};