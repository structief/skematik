const uuidV1 = require('uuid/v1');
const emitter = require('./helpers/emitter.js');
const jwt = require("jwt-simple");
const config = require('./helpers/config.js') 
const { getSchema } = require('./helpers/getScheme');

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
          } else {
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

          emitter.emit('mail.subscription.added', {insert});

          getSchema(pg, req.params.uuid, res);


        }).catch(function(error) {
          return res.send('error' + error)
        })
      }
    })
  }
}

module.exports = Answers;


