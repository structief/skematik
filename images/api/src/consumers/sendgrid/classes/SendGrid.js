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
    var _this = this;
    //Returns promise
    return new Promise(function(resolve, reject) {
      sgMail.send({
        to: _this.recipients,
        from: 'Skematik <hello@skematik.io>',
        subject: _this.subject,
        text: _this.text,
        html: _this.body,
        templateId: _this._templateId,
        substitutions: _this._substitutions
      },  (error, result) => {
        if (error) {
          //Log friendly error
          console.log("# ------ Mail error ------ #");
          reject(error);
        } else {
          //Celebrate
-          resolve(true);
        }
      });
    });
  }

  fake(){
     var _this = this;
    //Returns promise
    return new Promise(function(resolve, reject) {
      // Do async job
      console.log({
        to: _this.recipients,
        from: 'Skematik <hello@skematik.io>',
        subject: _this.subject,
        text: _this.text,
        html: _this.body,
        templateId: _this._templateId,
        substitutions: _this._substitutions
      });
      resolve(true);
    });
  }
}

// Export class
module.exports = Mail;
