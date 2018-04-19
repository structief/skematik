const uuidV1 = require('uuid/v1');
const emitter = require('./helpers/emitter.js');
const jwt = require("jwt-simple");
const config = require('./helpers/config.js') 

class Answers {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {


    app.get('/answers', async (req, res, next) => {
      await pg.select().table('answers').then((r) => {
        res.send(r)
      })
    })

    app.delete('/answers', async (req, res, next) => {
      await pg('answers').where({uuid: req.body.uuid}).del().then((r) => {
        res.send(200)
      })
    })

    app.get('/confirm/:token', async(req, res, next) => {
      await pg.select('uuid').table('answers').where({confirm_token: req.params.token}).then(async(cells) => {
        console.log("cell", cells)
        if(cells) { 
          await pg.table("answers").returning(['tableID']).update({activated: true}).where({confirm_token: req.params.token}).then((data) => {
            
            res.status(200).send({tableID: data[0].tableID})
          }).catch((error) => {
            console.log(error);
            res.status(401).send(error)
          })
        } else {
          res.status(400);
        }
      })
    })

    app.post('/schema/:uuid/answer', async (req, res, next) => {
      const insert = [];
      const token = jwt.encode({
        schema: req.params.uuid,
        user: req.body['participation']
      }, config.auth.secret);
      
      //Repeat for all lines of participation
      for(let i=0;i<req.body['participations'].length; i++){
        const participation = req.body['participations'][i];
        const timestamp = new Date();

        // Assess if can register
        await pg.select().table('answers').where({ cellID: participation['cell']['uuid']}).join('cells', 'cells.uuid', '=', 'answers.cellID').then((d) => {
          if(d.length > 0 && d.length >= d[0].max) {
            //do not allow
            return res.send(417, { message: 'no more place', cell: {uuid: participation['cell']['uuid']}});
          }else{
            const uuid = uuidV1();
            // send out token for mail

            //Add participation for insertion
            insert.push({
              cellID: participation['cell']['uuid'],
              tableID: req.params.uuid,
              participant: req.body['participant'],
              created_at: timestamp,
              updated_at: timestamp,
              uuid: uuid,
              confirm_token: token
            });
          }
        });
      }

      // add to answers, if there isn't already a 417 underway
      if(insert.length > 0 && !res.headersSent){
        //Up counter for each insertion
        for(let i=0;i<insert.length;i++){
          await pg.update({'current': pg.raw('current + 1')}).table('cells').where({uuid: insert[i]['cellID']}).then((v) => {
          });
        }
        
        //Add entire stuff to db
        await pg('answers').insert(insert).then(async(id) => {
          


          let result = {};
          const rowstructure = [];


          let answers = [];

          await pg.select().table('answers').where({tableID: req.params.uuid}).then((a) => {
            answers = a;
          });


          //Get scheme again
          await pg.select()
            .table('schema')
            .where({'schema.uuid': req.params.uuid})
            .join('cells', 'schema.id', '=', 'cells.tableID')
            .then( function (r) {
              if(r.length > 0) {

                result['uuid'] = req.params.uuid;
                result['title'] = r[0].title;
                const temp = [];
                Object.keys(r[0].headers).map((key, index) => {
                  temp.push(key);
                });
                result['headers'] = temp;


                result['created_at'] = r[0].created_at;
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

                // Subscription worked, fire event
                // Replace 'mail' by the selected method by the admin
                // But this is just a first setup
                emitter.emit('mail.subscription.added', {insert});

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
          return res.send('error' + error)
        })
      }
    })
  }
}

module.exports = Answers;


