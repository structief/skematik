const uuidV1 = require('uuid/v1');
const {checkToken} = require("./helpers/auth")
const multer  = require('multer')
const upload = multer({ dest: './uploads/' })

const Parse = require('csv-parse');
const fs = require('fs')

class Participants {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
    this.parseCSVFile = this.parseCSVFile.bind(this);
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

    app.post('/participants/upload', upload.single("participants"), async (req, res, next) => {
      if(req.headers.authorization) {
        checkToken('777', pg, req.headers.authorization, async (user) => {
          console.log(req.file)

          var filePath = req.file.path;
          console.log(filePath);

          const roles = await pg.select("uuid").table("roles").where({organisationID: user.organisation.uuid, type: "PARTICIPANT"})

          async function onNewRecord(record) {
            const data = record;
            record["organisationID"] = user.organisation.uuid;
            record["roles"] = JSON.stringify(roles);
            record["uuid"] = uuidV1();
            console.log(record);
            await pg.insert(data).table("participants").returning("*").then((res) => {
              // console.log(res)
            })
          }

          function onError(error){
              // console.log(error)
          }

          function done(linesRead){
              res.send(200, linesRead)
          }

          var columns = true; 
          this.parseCSVFile(filePath, columns, onNewRecord, onError, done);  
          
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
          const default_role = pg.select("uuid").table("roles").where({organisationID: user.organisation.uuid, type: "PARTICIPANT"});
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
              res.status(200).send({uuid: uuid1});
            })
          }
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

  parseCSVFile(sourceFilePath, columns, onNewRecord, handleError, done){
    var source = fs.createReadStream(sourceFilePath);
    var linesRead = 0;
    var parser = Parse({
        delimiter: ',', 
        columns:columns
    });
    parser.on("readable", function(){
        var record;
        while (record = parser.read()) {
            linesRead++;
            onNewRecord(record);
        }
    });
    parser.on("error", function(error){
        handleError(error)
    });
    parser.on("end", function(){
        done(linesRead);
    });
    source.pipe(parser);
  }

}


module.exports = Participants;
