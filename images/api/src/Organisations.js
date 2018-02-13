const uuidV1 = require('uuid/v1');

class Organisations {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {


    app.get('/organisations', async (req, res, next) => {
      await pg.select().table("organisations").then(function(r) {
        res.send(r)
      })
    })

    app.delete('/organisations', async (req, res, next) => {
      await pg("roles").where({organisationID: req.body.uuid}).del();
      await pg("organisations").where({uuid: req.body.uuid}).del().then(function(r) {
        res.send(r)
      })
    })

    app.get('/organisations/:uuid', async (req, res, next) => {
      await pg.select().table("organisations").where({uuid: req.params.uuid}).then(async (r) => {
        const roles = await pg.select(["uuid", "type", "short"]).table("roles").where({ organisationID: req.params.uuid});
        const users = await pg.select().table("users").where({organisation: req.params.uuid})
        r = r[0];
        r["users"] = users;
        r["roles"] = roles;
        res.send(r);
      })
    })

    app.post('/organisations', async (req, res, next) => {
      const request = {};

      request["uuid"] = uuidV1();
      request["name"] = req.body.name;
      request["created_at"] = new Date()
      request["updated_at"] = new Date()



      const insert1 =  await pg("organisations").insert(request);
      const insertRolesOwner = await pg("roles").insert({
        uuid: uuidV1(),
        organisationID: request["uuid"],
        type: "OWNER",
        short: "owner of the organisation",
        permissions: "777"
       })
      const insertRolesAdmin = await pg("roles").insert({
        uuid: uuidV1(),
        organisationID: request["uuid"],
        type: "ADMIN",
        short: "admin of the organisation",
        permissions: "777"
       })
      const insertRolesUser = await pg("roles").insert({
        uuid: uuidV1(),
        organisationID: request["uuid"],
        type: "USER",
        short: "user of the organisation",
        permissions: "300"
      })
      const insertRolesParticipant = await pg("roles").insert({
        uuid: uuidV1(),
        organisationID: request["uuid"],
        type: "PARTICIPANT",
        short: "participant of the organisation",
        permissions: "300"
      })
      res.send(200, { uuid: request["uuid"]})

    })

  }

}

module.exports = Organisations;
