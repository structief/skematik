const uuidV1 = require('uuid/v1');

const {checkToken} = require("./helpers/auth")

class Roles {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {




    app.get('/roles', async (req, res, next) => {
      checkToken('333', pg, req.headers.authorization, async (user) => {
        const list = await pg.select().table('roles').where({organisationID: user.organisation.uuid});
        res.send(200, list);
      }, res)

    })

    app.post('/roles', async (req, res, next) => {
      checkToken('777', pg, req.headers.authorization, async (user) => {
      
        const request = {};
        request["uuid"] = uuidV1();
        request["organisationID"] = req.body.organisationID;
        request["type"] = req.body.type;
        request["permissions"] = req.body.permissions;
        request["short"] = req.body.short;

        const id = await pg("roles").insert(request).returning('id');

        res.send(200, { uuid: request["uuid"]});
        
      }, res)

    })
  }


}

module.exports = Roles;
