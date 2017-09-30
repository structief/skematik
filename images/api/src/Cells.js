const uuidV1 = require('uuid/v1');

class Cells {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
  }

  assignFields(app, pg) {


    app.get('/cells', async (req, res, next) => {
      await pg.select().table("cells").then(function(r) {
        res.send(r)
      })
      console.log("tested")
    })

    app.post('/cells', async (req, res, next) => {
      const request = req.body;
      console.log("request", request)
      for(let i = 0; i < request.cells.length; i++) {
        request.cells[i]["uuid"] = uuidV1();
        await pg("cells").insert(request.cells[i]);
      }

      res.send(200)
    })

  }

}

module.exports = Cells;
