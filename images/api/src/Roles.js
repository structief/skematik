const uuidV1 = require('uuid/v1');

const {checkToken} = require("./helpers/auth")

class Roles {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {

    app.post('/roles', async (req, res, next) => {
      if(req.headers.authorization) {
        // TODO: check if token exists
        console.log(req.headers)
        checkToken(pg, req.headers.authorization, async (result) => {
        

          const request = {};
          request["uuid"] = uuidV1();
          request["organisationID"] = req.body.organisationID;
          request["type"] = req.body.type;
          request["permissions"] = req.body.permissions;
          request["short"] = req.body.short;

          const id = await pg("roles").insert(request).returning('id');

          res.send(200, { uuid: request["uuid"]});
          
        }, res)

      } else {
        res.sendStatus(400, { message: "no headers supplied"});
      }

    })
  }


}

module.exports = Roles;
