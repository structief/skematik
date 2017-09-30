const uuidV1 = require('uuid/v1');

class Users {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {


    app.get('/users', async (req, res, next) => {
      await pg.select().table("users").then(function(r) {
        res.send(r)
      })
      console.log("tested")
    })


    app.post('/users/list', async (req, res, next) => {
      const request = req.body;



      console.log("request", request)
      request["uuid"] = uuidV1();
      await pg("users").insert(request).then(function() {
        res.send({ uuid: request['uuid']})
      })
    })

    app.post('/users', async (req, res, next) => {
      const request = req.body;

      console.log("request", request)
      request["uuid"] = uuidV1();
      await pg("users").insert(request).then(function() {
        res.send({ uuid: request['uuid']})
      })
    })



    app.put('/users/:uuid/:organisationID', async (req, res, next) => {
      await pg("users").where({uuid: req.params.uuid}).update({organisation: req.params.organisationID}).then(function() {
        res.send({ uuid: req.params.uuid })
      })
    })

  }

}

module.exports = Users;
