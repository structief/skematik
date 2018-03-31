//{"name": string_name_of_emoji, "url": string_url_of_page}
const jwt = require("jwt-simple");
const uuidV1 = require('uuid/v1');
const config = require("./helpers/config.js")

class Feedback {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {

    app.post('/feedback', async (req, res, next) => {
      let userID = "";
      if(req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        // TODO: check if token exists
        const decoded = jwt.decode(token, config.auth.secret);
        userID = decoded.uuid
      }

      await pg.insert({
        feeling: req.body.feeling,
        message: req.body.message,
        url: req.body.url,
        user: userID,
        uuid: uuidV1()
      }).table('feedback');

      res.sendStatus(200)

    })
  }


}

module.exports = Feedback;
