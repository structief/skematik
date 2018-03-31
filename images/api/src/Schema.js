const uuidV1 = require('uuid/v1');
const moment = require('moment');

const {checkToken} = require('./helpers/auth')

class Schema {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {

    app.post('/schema', async (req, res, next) => {
      checkToken('777', pg, req.headers.authorization, async (user) => {
        const request = {};

        console.log(req.body)

        request['created_at'] = new Date();
        request['updated_at'] = new Date();
        request['uuid'] = uuidV1();
        request['creator'] = user.uuid;
        request['title'] = req.body.scheme.title;
        request['organisationID'] = user.organisation.uuid;
        request['consumer'] = {index: req.body.scheme.consumer};
        request['published'] = req.body.scheme.status;
        request['roles'] = req.body.scheme.roles;
        request['opens'] = moment(req.body.scheme.publication.from).format();
        request['closes'] = moment(req.body.scheme.publication.to).format();

        if(req.body.scheme.headers !== undefined){
          request['headers'] = req.body.scheme.headers.reduce(function(result, item, index, array) {
            result[item] = index; //a, b, c
            return result;
          }, {}) ;
        }else{
          request['headers'] = {};
        }

        if(req.body.scheme.rows !== undefined){
          request['rows'] = req.body.scheme.rows.reduce(function(result, item, index, array) {
            result[item.name] = index; //a, b, c
            return result;
          }, {});
        }else{
          request['rows'] = {};
        }

        const r = [];
        for(let role in request['roles']){
          const tRole = request['roles'][role].toUpperCase();
          await pg.select(['uuid', 'type']).table('roles').where({organisationID: request['organisationID'], type: tRole}).then((full) => {
            console.log(full)
            r.push(full[0]);
          }) 
        }
        request['roles'] = { 'roles': r}
      
        const id = await pg('schema').insert(request).returning('id');
        for(let i = 0; i < req.body.scheme.rows.length; i++) {
          for(let j = 0; j < req.body.scheme.rows[i].cells.length; j++) {
            const obj = {
              tableID: id[0],
              col: req.body.scheme.headers[j],
              row: req.body.scheme.rows[i].name,
              max: req.body.scheme.rows[i].cells[j].max,
              current: 0,
              uuid: uuidV1()
            }
            await pg('cells').insert(obj);
          }
        }
        req.params.uuid = request['uuid'];
        this.getSchema(pg, req, res);
      }, res)
    })



    app.put('/schema/:uuid', async (req, res, next) => {

      if(req.headers.authorization) {
        // TODO: check if token exists
        checkToken('777', pg, req.headers.authorization, async (user) => {
          const request = {};
          request['updated_at'] = new Date();
          if(req.body.scheme.headers) {
            request['headers'] = req.body.scheme.headers.reduce(function(result, item, index, array) {
              result[item] = index; //a, b, c
              return result;
            }, {}) ;
          }

          if(req.body.scheme.title) {
            request['title'] = req.body.scheme.title;
          }
          if(req.body.scheme.status) {
            request['published'] = parseInt(req.body.scheme.status);
          }
          if(req.body.scheme.consumer) {
            request['consumer'] = req.body.scheme.consumer;
          }
          if(req.body.scheme.rows) {
            request['rows'] = req.body.scheme.rows.reduce(function(result, item, index, array) {
              result[item.name] = index; //a, b, c
              return result;
            }, {}) 
          }
          if(req.body.scheme.status) {
            request['published'] = parseInt(req.body.scheme.status);
          }
          if(req.body.scheme.publication.from) {
            request['opens'] = req.body.scheme.publication.from;
          }
          if(req.body.scheme.publication.to) {
            request['closes'] = req.body.scheme.publication.to;
          }

          const id = await pg('schema').update(request).where({uuid: req.params.uuid}).returning('id');

          if(req.body.scheme.rows) {
            for(let i = 0; i < req.body.scheme.rows.length; i++) {
              for(let j = 0; j < req.body.scheme.rows[i].cells.length; j++) {
                if(req.body.scheme.rows[i].cells[j].uuid) {
                  const obj = {
                    max: req.body.scheme.rows[i].cells[j].max
                  }
                  await pg('cells').update(obj).where({uuid: req.body.scheme.rows[i].cells[j].uuid});
                } else {
                  const obj = {
                    tableID: id[0],
                    col: req.body.scheme.headers[j],
                    row: req.body.scheme.rows[i].name,
                    max: req.body.scheme.rows[i].cells[j].max,
                    current: 0,
                    uuid: uuidV1()
                  }
                  await pg('cells').insert(obj);
                }
              }
            }
          }
          this.getSchema(pg, req, res);
        }, res)
      } else {
        res.sendStatus(401);
      }

    })

    app.get('/schema/:uuid', async (req, res, next) => {
      this.getSchema(pg, req, res)
    });

    app.get('/schema', async (req, res, next) => {
      checkToken('000', pg, req.headers.authorization, async (user) => {
        let result = {};
        await pg.select(['uuid', 'title', 'published', 'id']).table('schema').where({organisationID: user.organisation.uuid}).orderBy('created_at', 'desc').then(async function(r) {
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
      }, res)
      
    })
  }

  async getSchema(pg, req, res) {
    let result = {};


    if(req.params.uuid == "new"){
      result = {
        "uuid": "new",
        "title": "A new scheme",
        "headers": ['A string', 11, 'Click me!', '13:00', 14, 'Tomorrow'],
        "rows": [
          {
            "name": "New row",
            "cells": [{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0}]
          },
          {
            "name": "Another one, I swear",
            "cells": [{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0}]
          }
        ],
        "status": 0,
        "publication": {
          "from": new Date(),
          "to": new Date()
        },
        "roles": [],
        "consumer": {
          "index": null
        }
      };
      res.status(200).send(result);
    }else{
      const rowstructure = [];


      let answers = [];
      await pg.select("answers.cellID", "answers.participant", "answers.created_at", "answers.updated_at", "cells.row", "cells.col").table("answers").where({"answers.tableID": req.params.uuid}).join('cells', 'cells.uuid', '=', 'answers.cellID').then(function(a) {
        answers = a;
      })


      // @TODO: make sure param 'uuid' is of type uuid
      await pg.select()
        .table('schema')
        .where({'schema.uuid': req.params.uuid})
        .leftJoin('cells', 'schema.id', '=', 'cells.tableID')
        .then(async function (r) {
          if(r.length > 0) {
            result['uuid'] = req.params.uuid;
            result['title'] = r[0].title;
            result['consumer'] = r[0].consumer;
            result['status'] = r[0].published;
            result['roles'] = r[0].roles.roles.map((role) => { console.log(role.type); return role.type });
            console.log(result['roles'], r[0].roles.roles)
            result['publication'] = {
              from: moment(r[0].opens).format(),
              to: moment(r[0].closes).format()
            };
            const temp = [];
            Object.keys(r[0].headers).map((key, index) => {
              temp.push(key);
            });
            result['headers'] = temp;


            result['created_at'] = r[0].created_at;
            result['updated_at'] = r[0].updated_at;

            Object.keys(r[0].rows).map((key, index) => {
              const found = [];
              for (let i = 0; i < r.length; i++) {
                if (r[i]['row'] === key) {
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


            result['rows'] = rowstructure;

            result['answers'] = answers;
            res.status(200).send(result);
          } else {
            res.status(404).send({error: 'something went wrong'});
          }
        });
    }
  }

}

module.exports = Schema;
