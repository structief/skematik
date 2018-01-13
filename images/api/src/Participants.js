const uuidV1 = require('uuid/v1');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');

class Participants {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {


    app.get('/participants/:schemaID', async (req, res, next) => {
      await pg.select().table("participants").then(function(r) {
        res.send(r)
      })
      console.log("tested")
    })

    app.delete('/participants/:participantsID', async (req, res, next) => {
      await pg("participants").where({uuid: req.params.participantsID}).del().then(function(r) {
        res.sendStatus(200)
      })
    })


    app.post('/participants', async (req, res, next) => {


      for(let i = 0; i < req.body.participants.length; i++) {
        const el = req.body.participants[i];
        const uuid1 = uuidV1();



        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(el.password, salt);
        const toAdd = {
          uuid: uuid1,
          organisation: req.body.organisation,
          username: el.username,
          password: hash,
          usermail: el.usermail
        }
        const added = await pg("users").insert(toAdd);

        const uuid2 = uuidV1();
        await pg("participants").insert({
          user: uuid1,
          uuid: uuid2,
          schema: req.body.schema
        }).then(function() {
          res.send(200)
        })
      }
    })

  }

}

module.exports = Participants;
