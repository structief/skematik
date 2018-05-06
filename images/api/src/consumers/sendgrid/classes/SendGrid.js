const sgMail = require('@sendgrid/mail');
const fs = require('fs');

const config = require('./../config.js');

class Mail {
  constructor() {
    sgMail.setApiKey(config.apiKey);
    sgMail.setSubstitutionWrappers('{{', '}}');

    this._recipients = [];
    this._subject = "A Skematik mail";
    this._text = "Default texting, please do replace me";
    this._body = null; // Replace by body
    this._templateId = config.subscriptionTemplateId;
    this._substitutions = {};
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
  set templateId(templateId){
    this._templateId = templateId;
  }
  get templateId(){
    return this._templateId;
  }

  //Substitutions
  set substitutions(substitutions){
    this._substitutions = substitutions;
  }
  get substitutions(){
    return this._substitutions;
  }

  send(){
    sgMail.send({
      to: this.recipients,
      from: 'hello@skematik.io',
      subject: this.subject,
      text: this.text,
      html: this.body,
      templateId: this._templateId,
      substitutions: this._substitutions
    }, true)
    .then(function(){
      //Celebrate
      return true;
    })
    .catch(function(error){
      //Log friendly error
      return error.toString();
    });
  }

  fake(){
    return {
      to: this.recipients,
      from: 'hello@skematik.io',
      subject: this.subject,
      text: this.text,
      html: this.body,
      templateId: this._templateId,
      substitutions: this._substitutions
    };
  }
}

// Export class
module.exports = Mail;
