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
        checkToken(pg, req.headers.authorization, async (result) => {
          if(result.length > 0) {
            const request = {};

            request["created_at"] = new Date();
            request["updated_at"] = new Date();
            request["uuid"] = uuidV1();
            request["creator"] = result[0].user;

            request["headers"] = req.body.headers.reduce(function(result, item, index, array) {
              result[index] = item; //a, b, c
              return result;
            }, {}) ;

            request['title'] = req.body.title;

            request['rows'] = req.body.rows.reduce(function(result, item, index, array) {
              result[index] = item.name; //a, b, c
              return result;
            }, {}) 

            request['published'] = false

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


            res.send(request);
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
              temp.push(r[0]['headers'][key]);
            });
            result["headers"] = temp;

            result["created_at"] = r[0].created_at;
            result["created_at"] = r[0].created_at;
            result["updated_at"] = r[0].updated_at;


            Object.keys(r[0].rows).map((key, index) => {
              const found = [];
              for (let i = 0; i < r.length; i++) {
                if (r[i]["row"] === r[0].rows[key]) {
                  const num = answers.filter(answer => answer.cellID === r[i].uuid);
                  found.push({
                    max: r[i].max,
                    current: num,
                    col: r[i].col,
                    uuid: r[i].uuid
                  })
                }
              }
              rowstructure.push({
                name: key,
                cells: found
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


  }

}

module.exports = Schema;
