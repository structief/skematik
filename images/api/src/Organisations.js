const uuidV1 = require('uuid/v1');

class Organisations {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {


    app.get('/organisations', async (req, res, next) => {
      await pg.select().table("organisations").then(function(r) {
        res.send(r)
      })
      console.log("tested")
    })

    app.delete('/organisations', async (req, res, next) => {
      await pg("organisations").where({uuid: req.body.uuid}).del().then(function(r) {
        res.send(r)
      })
      console.log("tested")
    })

    app.get('/organisations/:uuid', async (req, res, next) => {
      await pg.select().table("organisations").where({uuid: req.params.uuid}).then(async (r) => {
        await pg.select().table("users").where({organisation: req.params.uuid}).then(function(result) {
          r = r[0];
          r["users"] = result;
          res.send(r)
        });
      })
      console.log("tested")
    })

    app.post('/organisations', async (req, res, next) => {
      const request = req.body;

      console.log("request", request)
      request["uuid"] = uuidV1();
      await pg("organisations").insert(request).then(function() {
        res.send({ uuid: request['uuid']})
      })
    })

  }

}

module.exports = Organisations;
