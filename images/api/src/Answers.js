const uuidV1 = require('uuid/v1');
const emitter = require('./helpers/emitter.js');

class Answers {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {


    app.get('/answers', async (req, res, next) => {
      await pg.select().table("answers").then(function(r) {
        res.send(r)
      })
    })

    app.delete('/answers', async (req, res, next) => {
      await pg("answers").where({uuid: req.body.uuid}).del().then(function(r) {
        res.send(200)
      })
    })

    app.post('/schema/:uuid/answer', async (req, res, next) => {
      const insert = [];

      //Repeat for all lines of participation
      for(var i=0;i<req.body["participations"].length; i++){
        var participation = req.body["participations"][i];
        var timestamp = new Date();

        insert.push({
          "cellID": participation["cell"]["uuid"],
          "tableID": req.params.uuid,
          "participant": req.body["participant"],
          "created_at": timestamp,
          "updated_at": timestamp
        });

        await pg.update({'current': pg.raw('current + 1')}).table('cells').where({uuid: participation["cell"]['uuid']}).then(function(v) {
        });

        // Asses if can register
        await pg.select().table('answers').where({ cellID: participation["cell"]['uuid']}).join('cells', 'cells.uuid', '=', 'answers.cellID').then(function(d) {
          if(d.length > 0 && d.length >= d[0].max) {
            //do not allow
            return res.send(417, { message: 'no more place', cell: {uuid: participation["cell"]['uuid']}});
          }
        });
      }

      // add to answers
      await pg("answers").insert(insert).then(async(id) => {
        


        let result = {};
        const rowstructure = [];


        let answers = [];

        await pg.select().table("answers").where({tableID: req.params.uuid}).then(function(a) {
          answers = a;
        });


        //Get scheme again
        await pg.select()
          .table("schema")
          .where({"schema.uuid": req.params.uuid})
          .join('cells', 'schema.id', "=", "cells.tableID")
          .then( function (r) {
            if(r.length > 0) {

              result["uuid"] = req.params.uuid;
              result["title"] = r[0].title;
              const temp = [];
              Object.keys(r[0].headers).map((key, index) => {
                temp.push(key);
              });
              result["headers"] = temp;


              result["created_at"] = r[0].created_at;
              result["created_at"] = r[0].created_at;
              result["updated_at"] = r[0].updated_at;


              Object.keys(r[0].rows).map((key, index) => {
                const found = [];
                for (let i = 0; i < r.length; i++) {
                  if (r[i]["row"] === key) {
                    const num = answers.filter(answer => answer.cellID === r[i].uuid);
                    found.push({
                      max: r[i].max,
                      current: num,
                      col: r[i].col,
                      uuid: r[i].uuid
                    })
                  }
                }

                const intermediary = [];

                for(let i = 0; i < temp.length; i++) {
                  for(let j = 0; j < found.length; j++) {
                    if(found[j].col === temp[i]) {
                      intermediary.push(found[j])
                    }
                  }
                }

                rowstructure.push({
                  name: key,
                  cells: intermediary
                });
              });


              result["rows"] = rowstructure;

              result["answers"] = answers;

              // Subscription worked, fire event
              // Replace 'mail' by the selected method by the admin
              // But this is just a first setup
              emitter.emit("mail.subscription.added", {insert});

              res.send(result);
            } else {
              res.sendStatus(404);
            }
          })
          .then(function() {})
          .catch(function(error) {
            res.sendStatus(404);
          })
      }).catch(function(error) {
        return res.send("error" + error)
      })
    })
  }
}

module.exports = Answers;


