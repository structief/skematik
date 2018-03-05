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
      const insert = {};


      insert["cellID"] = req.body["cellID"];
      insert["tableID"] = req.params.uuid;
      insert["participant"] = req.body["participant"];

      insert["created_at"] = new Date();
      insert["updated_at"] = new Date();

      // asses if can register
      let go = false;
      await pg.update({'current': pg.raw('current + 1')}).table('cells').where({uuid: insert['cellID']}).then(function(v) {
      })

      await pg.select().table('answers').where({ cellID: insert['cellID']}).join('cells', 'cells.uuid', '=', 'answers.cellID').then(function(d) {
        if(d.length > 0 && d.length >= d[0].max) {
          //do not allow
          res.send(417, { message: 'no more place'});
        } else {
          go = true;
        }
      })

      // add to answers
      if( go ) {
        await pg("answers").insert(insert).then(async(id) => {
          


          let result = {};
          const rowstructure = [];


          let answers = [];

          await pg.select().table("answers").where({tableID: req.params.uuid}).then(function(a) {
            answers = a;
          });



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
                emitter.event("mail.subscription.added", {insert});
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
          res.send("error" + error)
        })
      }
    })
  }
}

module.exports = Answers;


