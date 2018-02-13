const uuidV1 = require('uuid/v1');
const {checkToken} = require("./helpers/auth")

class Participants {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {


    app.get('/participants/:schemaID', async (req, res, next) => {

      if(req.headers.authorization) {
        checkToken('777', pg, req.headers.authorization, async (user) => {
          console.log(user)
          await pg.select().table("participants").where({organisationID: user.organisationID}).then(function(r) {
            res.send(r)
          })
        })
      }
    })

    app.delete('/participants/:participantsID', async (req, res, next) => {
      await pg("participants").where({uuid: req.params.participantsID}).del().then(function(r) {
        res.sendStatus(200)
      })
    })


    app.post('/participants', async (req, res, next) => {


      const roles = pg.select("uuid").table("roles").where({organisationID: req.body.organisationID, type: "PARTICIPANT"});
      for(let i = 0; i < req.body.participants.length; i++) {
        const el = req.body.participants[i];
        const uuid1 = uuidV1();
        await pg("participants").insert({
          uuid: uuid1,
          mail: req.body.mail,
          roles: {roles: roles},
          code: "",
          status: "created",
          organisationID: req.body.organisationID
        }).then(function() {
          res.send(200)
        })
      }
    })


    app.put('/participants', async (req, res, next) => {
      //flush all existing

      const role = pg.select("uuid").table("roles").where({organisationID: req.body.organisationID, type: "PARTICIPANT"})[0];

      await pg("participants").delete().where({ organisationID: req.body.organisationID}).then(async(data) => {
        for(let i = 0; i < req.body.participants.length; i++) {
          const el = req.body.participants[i];
          const uuid1 = uuidV1();


          await pg("participants").insert({
            uuid: uuid1,
            mail: req.body.mail,
            roles: {roles: roles},
            code: "",
            status: "created",
            organisationID: req.body.organisationID
          }).then(function() {
            res.send(200)
          })
        }
      })
    })

  }

}

module.exports = Participants;
