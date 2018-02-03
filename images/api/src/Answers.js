const uuidV1 = require('uuid/v1');


class Answers {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {


    app.get('/answers', async (req, res, next) => {
      await pg.select().table("answers").then(function(r) {
        res.send(r)
      })
      console.log("tested")
    })

    app.delete('/answers', async (req, res, next) => {
      await pg("answers").where({uuid: req.body.uuid}).del().then(function(r) {
        res.send(200)
      })
    })




    app.post('/schema/:uuid/answer', async (req, res, next) => {

      //check for token 

      
      const insert = {};


      insert["cellID"] = req.body["cellID"];
      insert["tableID"] = req.params.uuid;
      insert["userID"] = uuidV1();
      insert["usermail"] = req.body["participant"];

      insert["created_at"] = new Date();
      insert["updated_at"] = new Date();

      // asses if can register
      let go = false;
      await pg.update({'current': pg.raw('current + 1')}).table('cells').where({uuid: insert['cellID']}).then(function(v) {
        console.log("updated")
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
        await pg("answers").insert(insert).returning("id").then(function(id) {
          res.send(200, id)
        }).catch(function(error) {
          res.send("error" + error)
        })
      }
    })





  }

}

module.exports = Answers;


