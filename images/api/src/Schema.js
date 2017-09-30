const uuidV1 = require('uuid/v1');

class Schema {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {

    app.post('/schema', async (req, res, next) => {
      const request = req.body;
      request["created_at"] = new Date();
      request["updated_at"] = new Date();
      request["uuid"] = uuidV1();
      const id = await pg("schema").insert(req.body).returning('id');
      res.send(id)
    })



    app.get('/schema/:uuid', async (req, res, next) => {
      let result = {};
      const rowstructure = [];

      let answers = [];
      await pg.select().table("answers").where({tableID: req.params.uuid}).then(function(a) {
        answers = a;
      })

      // @TODO: make sure param 'uuid' is of type uuid

      await pg.select()
        .table("schema")
        .where({"schema.uuid": req.params.uuid})
        .join('cells', 'schema.id', "=", "cells.tableID")
        .then( function (r) {
          // @TODO: send 404 if schema is not found

          if(req.length > 0) {

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
                  console.log(num)
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
