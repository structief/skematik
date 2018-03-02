const uuidV1 = require('uuid/v1');
const {checkToken} = require("./helpers/auth")
const multer  = require('multer')
const upload = multer({ dest: './uploads/' })

const fs = require('fs')

class Participants {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {


    app.get('/participants', async (req, res, next) => {
      //Is authorization present?
      if(req.headers.authorization) {
        //Check if user has necessary rights
        checkToken('777', pg, req.headers.authorization, async (user) => {
          await pg.select().table("participants").where({organisationID: user.organisation.uuid}).orderBy('mail', 'desc').then(function(r) {
            res.send(r)
          })
        }, res)
      }else{
        res.sendStatus(401);
      }
    })

    app.delete('/participants/:participantsID', async (req, res, next) => {
       //Is authorization present?
      if(req.headers.authorization) {
        //Check if user has necessary rights
        checkToken('777', pg, req.headers.authorization, async (user) => {
          await pg("participants").where({uuid: req.params.participantsID}).del().then(function(r) {
            res.sendStatus(200)
          }).catch((error) => {
            res.status(401).send({ERROR: error});
          })
        }, res)
      }else{
        res.sendStatus(401);
      }
    })


    app.post('/participants', async (req, res, next) => {
      //Is authorization present?
      if(req.headers.authorization) {
        //Check if user has necessary rights
        checkToken('777', pg, req.headers.authorization, async (user) => {
          //Lookup default role, just in case
          var default_role = "", uuids = [];
          await pg.select(["uuid", "type", "short"]).table("roles").where({organisationID: user.organisation.uuid, type: "PARTICIPANT"}).then(function(r) {
            default_role = r;
          });

          for(let i = 0; i < req.body.participants.length; i++) {
            const participant = req.body.participants[i];
            //Participant should contain roles, but in case it doesn't, add the default role
            if(participant.roles == undefined){
              participant.roles = default_role;
            }

            //Error handle entry
            if(participant.mail == null || participant.status == null){
              res.sendStatus(400);
            }
            const uuid1 = uuidV1();
            //Insert participant
            await pg("participants").insert({
              uuid: uuid1,
              mail: participant.mail,
              roles: JSON.stringify(participant.roles),
              code: "",
              status: participant.status,
              organisationID: user.organisation.uuid
            }).then(function() {
              uuids.push(uuid1);
            })
          }
          res.status(200).send({uuid: uuids});
        }, res);
      }else{
        res.sendStatus(401);
      }
    })


    app.put('/participants', async (req, res, next) => {
      //Is authorization present?
      if(req.headers.authorization) {
        //Check if user has necessary rights
        checkToken('777', pg, req.headers.authorization, async (user) => {
          await pg.select("uuid").table("roles").where({organisationID: user.organisation.uuid, type: "PARTICIPANT"}).then(async (roles) => {

            for(let i = 0; i < req.body.participants.length; i++) {
              const el = req.body.participants[i];
              if(el.uuid) {
                await pg("participants").update({
                  status: el.status,
                  mail: el.mail,
                  roles: JSON.stringify(el.roles)
                }).where({uuid: el.uuid})     
              
              } else {
                const uuid1 = uuidV1();
                await pg("participants").insert({
                  uuid: uuid1,
                  status: el.status,
                  mail: el.mail,
                  roles: JSON.stringify(el.roles),
                  organisationID: user.organisation.uuid
                })
              }
            }

            res.sendStatus(200);
          }).catch((error) => {
            res.status(500).send({ ERROR: error});
          });
        });
      }else{
        res.sendStatus(401);
      }
    });
  }
}


module.exports = Participants;
