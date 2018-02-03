const uuidV1 = require('uuid/v1');

const {checkToken} = require("./helpers/auth")

class Schema {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {

    app.post('/schema', async (req, res, next) => {


      if(req.headers.authorization) {
        // TODO: check if token exists
        console.log(req.headers)
        checkToken(pg, req.headers.authorization, async (user) => {
          const request = {};

          request["created_at"] = new Date();
          request["updated_at"] = new Date();
          request["uuid"] = uuidV1();
          request["creator"] = user.uuid;

          request["headers"] = req.body.headers.reduce(function(result, item, index, array) {
            result[item] = index; //a, b, c
            return result;
          }, {}) ;

          request['title'] = req.body.title;

          request['rows'] = req.body.rows.reduce(function(result, item, index, array) {
            result[item.name] = index; //a, b, c
            return result;
          }, {}) 

          request['published'] = 0

          const id = await pg("schema").insert(request).returning('id');
          for(let i = 0; i < req.body.rows.length; i++) {
            for(let j = 0; j < req.body.rows[i].cells.length; j++) {
              const obj = {
                tableID: id[0],
                col: req.body.headers[j],
                row: req.body.rows[i].name,
                max: req.body.rows[i].cells[j].max,
                current: 0,
                uuid: uuidV1()
              }
              await pg("cells").insert(obj);
            }
          }


        }, res)

      } else {
        res.sendStatus(401);
      }

    })



    app.put('/schema/:uuid', async (req, res, next) => {


      if(req.headers.authorization) {
        // TODO: check if token exists
        console.log(req.headers)
        checkToken(pg, req.headers.authorization, async (result) => {
          console.log(result)
          if(result.length > 0) {
            const request = {};

            request["updated_at"] = new Date();
            if(req.body.headers) {
              request["headers"] = req.body.headers.reduce(function(result, item, index, array) {
                result[item] = index; //a, b, c
                return result;
              }, {}) ;
            }

            if(req.body.title) {
              request['title'] = req.body.title;
            }

            if(req.body.rows) {
              request['rows'] = req.body.rows.reduce(function(result, item, index, array) {
                result[item.name] = index; //a, b, c
                return result;
              }, {}) 
            }

            if(req.body.published) {
              request['published'] = req.body.published
            }
            if(req.body.opens) {
              request['opens'] = req.body.opens
            }
            if(req.body.closes) {
              request['closes'] = req.body.closes
            }


            const id = await pg("schema").update(request).where({uuid: req.params.uuid}).returning('id');

            if(req.body.rows) {
              for(let i = 0; i < req.body.rows.length; i++) {
                for(let j = 0; j < req.body.rows[i].cells.length; j++) {
                  if(req.body.rows[i].cells[j].uuid) {
                    const obj = {
                      max: req.body.rows[i].cells[j].max
                    }
                    await pg("cells").update(obj).where({uuid: req.body.rows[i].cells[j].uuid});
                  } else {
                    const obj = {
                      tableID: id[0],
                      col: req.body.headers[j],
                      row: req.body.rows[i].name,
                      max: req.body.rows[i].cells[j].max,
                      current: 0,
                      uuid: uuidV1()
                    }
                    await pg("cells").insert(obj);
                  }
                }
              }
            }

            await pg('schema').select('*').where({uuid: req.params.uuid}).then((data) => {
              res.send(data)
            }).catch(() => {
              res.send('401', 'could not fetch')
            })
          } else {
            res.send(401, {status: 401, message: "token not found"})
          }
        })

      } else {
        res.sendStatus(401);
      }

    })

    







    app.get('/schema/:uuid', async (req, res, next) => {
      let result = {};
      const rowstructure = [];


      let answers = [];
      await pg.select().table("answers").where({tableID: req.params.uuid}).then(function(a) {
        answers = a;
      })

      console.log(answers)

      // @TODO: make sure param 'uuid' is of type uuid

      await pg.select()
        .table("schema")
        .where({"schema.uuid": req.params.uuid})
        .join('cells', 'schema.id', "=", "cells.tableID")
        .then( function (r) {
          console.log(r)
          if(r.length > 0) {

            result["uuid"] = req.params.uuid;
            result["title"] = r[0].title;
            const temp = [];
            Object.keys(r[0].headers).map((key, index) => {
              temp.push(key);
            });
            result["headers"] = temp;

            console.log(temp)

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
            res.send(result);
          } else {
            res.sendStatus(404);

          }
        }).then(function() {
        }).catch(function(error) {
          res.sendStatus(404);
        })
    });

    app.get('/schema', async (req, res, next) => {
      var result = {};
      await pg.select(['uuid', 'title', 'published', 'id']).table("schema").then(async function(r) {
        for(let i = 0; i< r.length; i++) {
          const el = r[i];
          let totalMax = 0;
          let totalCur = 0;
          await pg.select().table('cells').where({'tableID': el.id}).then(function(cellRes) {
            for(let j = 0; j < cellRes.length; j++) {
              totalMax += cellRes[j].max;
              totalCur += cellRes[j].current
            }
          }).catch((error) => {
            res.sendStatus(400)
          })

          r[i]['maxParticipants'] = totalMax;
          r[i]['currentParticipants'] = totalCur;

        }
        //all schemas
        res.send(r);
      })
      console.log(result)
    })
  }

}

module.exports = Schema;
