const uuidV1 = require('uuid/v1');
const {checkToken} = require("./helpers/auth")

class Users {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {


    app.get('/users', async (req, res, next) => {

      if(req.headers.authorization) {
        checkToken(pg, req.headers.authorization, async (user) => {
          const list = await pg.select().table('users').where({'organisation': user.organisation.uuid});
          res.send(list)
          console.log("tested")
        }, res)
      }
    })


    app.get('/users/all', async (req, res, next) => {
      await pg.select().table("users").then(function(r) {
        res.send(r)
      })
      console.log("tested")
    })



    app.delete('/users', async (req, res, next) => {
      await pg("users").where({uuid: req.body.uuid}).del().then(function(r) {
        res.send(200)
      })
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
      request["uuid"] = uuidV1();
      const userRole = await pg("roles").select("uuid").where({ type: "USER", organisationID: req.body.organisation});
      request["roles"] = { roles: userRole }
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
