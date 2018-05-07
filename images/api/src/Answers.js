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
        await pg.table("answers").returning("*").update({activated: true}).where({confirm_token: req.params.token}).then(async(data) => {
          if(data){
            // Confirmation worked, fire event
            var eventData = {
              participant: null,
              scheme: {},
              participations: []
            };
            eventData.participant = data[0].participant;
            //Loop over answers and put them in event emitter
            for(var i = 0; i < data.length; i++){
              await pg.select().table('cells').where({uuid: data[i].cellID}).then(async(cell) => {
                eventData.participations.push({"col": cell[0].col, "row": cell[0].row});
              });
            }
            await pg.select().table('schema').where({uuid: data[0].tableID}).then(async(schema) => {
              eventData.scheme = schema[0];
              emitter.emit(schema[0].consumer['index'] + '.subscription.confirmed', {eventData});
            });

            // Return tableId to front-end for redirection
            res.status(200).send({tableID: data[0].tableID});
          }else{
            res.status(404).send({message: "No participation found"});
          }
        }).catch((error) => {
          console.log(error);
          res.status(400).send({message: "Something went wrong, please try again later"});
        });
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
          // Emit event for consumers
          // Subscription worked, fire event
          const eventData = {
            participant: null,
            scheme: {},
            participations: [],
            confirmToken: null,
            origin: req.get("Origin")
          };

          eventData.participant = insert[0].participant;
          //Loop over answers and put them in event emitter
          for(var i = 0; i < insert.length; i++){
            eventData.confirmToken = insert[i].confirm_token;
            await pg.select().table('cells').where({uuid: insert[i].cellID}).then(async(cell) => {
              eventData.participations.push({"col": cell[0].col, "row": cell[0].row});
            });
          }
          await pg.select().table('schema').where({uuid: req.params.uuid}).then(async(schema) => {
            eventData.scheme = schema[0]; 
            emitter.emit(schema[0].consumer['index'] + '.subscription.added', {eventData});
          });

          // Return schema for front-end
          getSchema(pg, req.params.uuid, res);
        }).catch(function(error) {
          return res.status(400).send('error' + error);
        })
      }
    })
  }
}

module.exports = Answers;