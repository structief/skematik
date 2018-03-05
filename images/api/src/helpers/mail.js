const sgMail = require('@sendgrid/mail');
var fs = require('fs');

class Mail {
  constructor() {
    sgMail.setApiKey('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');
    sgMail.setSubstitutionWrappers('{{', '}}');

    this._recipients = [];
    this._subject = "A Skematik mail";
    this._text = "Default texting, please do replace me";
    this._body = null; // Replace by body
    this._template_id = 'bbb1133a-c69f-428f-93c5-1dc9783f0c7f'; // See SendGrid
  }

  //Recipients
  set recipients(recipients){
    this._recipients = recipients;
  }
  get recipients(){
    return this._recipients;
  }

  //Subject
  set subject(subject){
    this._subject = subject;
  }
  get subject(){
    return this._subject;
  }

  //Text
  set text(text){
    this._text = text;
  }
  get text(){
    return this._text;
  }

  //Body
  set body(body){
    this._body = body;
  }
  get body(){
    return this._body;
  }

  //Template ID
  set template_id(template_id){
    this._template_id = template_id;
  }
  get template_id(){
    return this._template_id;
  }

  send(){
    sgMail.send({
      to: this.recipients,
      from: 'hello@skematik.io',
      subject: this.subject,
      text: this.text,
      html: this.body,
      templateId: this._template_id,
      substitutions: {
        previewText: this.text,
        body: this.body,
        title: "Require some lines",
        firstname: "Franklin",
        buttonName: "Call on me",
        buttonUrl: "http://www.google.com"
      }
    }, true)
    .then(function(){
      //Celebrate
      console.log("Mail sent!");
    })
    .catch(function(error){
      //Log friendly error
      console.error(error.toString());

      //Extract error msg
      const {message, code, response} = error;

      //Extract response msg
      const {headers, body} = response;
    });
  }
}

// Export class
module.exports = Mail;
