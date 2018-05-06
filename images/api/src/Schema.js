const uuidV1 = require('uuid/v1');
const moment = require('moment');

const { checkToken } = require('./helpers/auth')
const { getSchema } = require('./helpers/getScheme');

class Schema {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {

    app.post('/schema', async (req, res, next) => {
      checkToken('777', pg, req.headers.authorization, async (user) => {
        const request = {};
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

        if (req.body.scheme.headers !== undefined){
          request['headers'] = req.body.scheme.headers.reduce(function(result, item, index, array) {
            result[item] = index; //a, b, c
            return result;
          }, {}) ;
        }
        else{
          request['headers'] = {};
        }

        if (req.body.scheme.rows !== undefined){
          request['rows'] = req.body.scheme.rows.reduce(function(result, item, index, array) {
            result[item.name] = index; //a, b, c
            return result;
          }, {});
        } 
        else {
          request['rows'] = {};
        }

        const r = [];
        for (let role in request['roles']){
          const tRole = request['roles'][role].toUpperCase();
          await pg.select(['uuid', 'type']).table('roles').where({organisationID: request['organisationID'], type: tRole}).then((full) => {
            console.log(full)
            r.push(full[0]);
          }) 
        }
        request['roles'] = { 'roles': r}
      
        const id = await pg('schema').insert(request).returning('id');
        req.params.uuid = request['uuid'];
        getSchema(pg, req.params.uuid, res);
      }, res)
    })

    app.put('/schema/:uuid', async (req, res, next) => {

      if (req.headers.authorization) {
        // TODO: check if token exists
        checkToken('777', pg, req.headers.authorization, async (user) => {
          const request = {};
          request['updated_at'] = new Date();
          if (req.body.scheme.headers) {
            request['headers'] = req.body.scheme.headers.reduce(function(result, item, index, array) {
              result[item] = index; //a, b, c
              return result;
            }, {}) ;
          }


          if (req.body.scheme.title) {
            request['title'] = req.body.scheme.title;
          }
          if (req.body.scheme.status) {
            request['published'] = parseInt(req.body.scheme.status);
          }
          if (req.body.scheme.consumer) {
            request['consumer'] = req.body.scheme.consumer;
          }
          if (req.body.scheme.roles) {
            const r = [];
            for (let role in req.body.scheme.roles){
              const tRole = req.body.scheme.roles[role].toUpperCase();
              await pg.select(['uuid', 'type']).table('roles').where({organisationID: user.organisation.uuid, type: tRole}).then((full) => {
                r.push(full[0]);
              }) 
            }
            request['roles'] = { 'roles': r}
          }
          if (req.body.scheme.rows) {
            request['rows'] = req.body.scheme.rows.reduce(function(result, item, index, array) {
              result[item.name] = index; //a, b, c
              return result;
            }, {}) 
          }
          if (req.body.scheme.status) {
            request['published'] = parseInt(req.body.scheme.status);
          }
          if (req.body.scheme.publication.from) {
            request['opens'] = moment(req.body.scheme.publication.from).format();
          }
          if (req.body.scheme.publication.to) {
            request['closes'] = moment(req.body.scheme.publication.to).format();
          }

          const id = await pg('schema').update(request).where({uuid: req.params.uuid}).returning('id');

          if (req.body.scheme.rows) {
            for (let i = 0; i < req.body.scheme.rows.length; i++) {
              for (let j = 0; j < req.body.scheme.rows[i].cells.length; j++) {
                if (req.body.scheme.rows[i].cells[j].uuid) {
                  const obj = {
                    max: req.body.scheme.rows[i].cells[j].max
                  }
                  await pg('cells').update(obj).where({uuid: req.body.scheme.rows[i].cells[j].uuid});
                } 
                else {
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
          getSchema(pg, req.params.uuid, res);
        }, res)
      } 
      else {
        res.sendStatus(401);
      }

    })

    app.get('/schema/:uuid', async (req, res, next) => {
      getSchema(pg, req.params.uuid, res)
    });

    app.get('/schema', async (req, res, next) => {
      checkToken('000', pg, req.headers.authorization, async (user) => {
        let result = {};
        await pg.select(['uuid', 'title', 'published', 'id']).table('schema').where({organisationID: user.organisation.uuid}).orderBy('created_at', 'desc').then(async function(r) {
          for (let i = 0; i< r.length; i++) {
            const el = r[i];
            let totalMax = 0;
            let totalCur = 0;
            await pg.select().table('cells').where({'tableID': el.id}).then(function(cellRes) {
              for (let j = 0; j < cellRes.length; j++) {
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


}

module.exports = Schema;
