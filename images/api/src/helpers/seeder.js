const faker = require('faker');
const uuidV1 = require('uuid/v1');


class Schema {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
    this.createSchema = this.createSchema.bind(this);
  }

  assignFields(app, pg) {

    app.get('/faker', async (req, res, next) => {

      this.createSchema(pg);


      await pg.select().table('schema').then(function(r) {
        res.send(r);
      })
    })
  }


  async createSchema(pg) {

    const cat1  = faker.random.word(),
      cat2 = faker.random.word(),
      cat3 = faker.random.word()

    console.log(faker.definitions)
    const vals = {
      "title": `${faker.random.word()} ${faker.random.word()}`,
      "headers": {
          "12 uur": faker.random.word(),
          "13 uur": faker.random.word(),
          "14 uur": faker.random.word()
      },
      "rows": {},
      "opens":  faker.date.future(),
      "closes": faker.date.future(),
      "uuid": uuidV1(),
      published: false

    }
    vals['rows'][cat1] = faker.lorem.sentence();
    vals['rows'][cat2] = faker.lorem.sentence();
    vals['rows'][cat3] = faker.lorem.sentence();


    const id = await pg('schema').insert(vals).returning('id');
    console.log(id);

    const cells =[
      {
          "tableID": parseInt(id),
          "max": parseInt(faker.random.number(100)),
          "col": '12 uur',
          "row": cat1,
          "current": 0,
          uuid: uuidV1()
      },{
          "tableID": parseInt(id),
          "max": parseInt(faker.random.number(100)),
          "col": '12 uur',
          "row": cat3,
          "current": 0,
          uuid: uuidV1()
      },{
          "tableID": parseInt(id),
          "max": parseInt(faker.random.number(100)),
          "col": "12 uur",
          "row": cat2,
          "current": 0,
          uuid: uuidV1()
      },{
          "tableID": parseInt(id),
          "max": parseInt(faker.random.number(100)),
          "col": "13 uur",
          "row": cat1,
          "current": 0,
          uuid: uuidV1()
      },{
          "tableID": parseInt(id),
          "max": parseInt(faker.random.number(100)),
          "col": "13 uur",
          "row": cat3,
          "current": 0,
          uuid: uuidV1()
      },{
          "tableID": parseInt(id),
          "max": parseInt(faker.random.number(100)),
          "col": "13 uur",
          "row": cat2,
          "current": 0,
          uuid: uuidV1()
      },{
          "tableID": parseInt(id),
          "max": parseInt(faker.random.number(100)),
          "col": "14 uur",
          "row": cat1,
          "current": 0,
          uuid: uuidV1()
      },{
          "tableID": parseInt(id),
          "max": parseInt(faker.random.number(100)),
          "col": "14 uur",
          "row": cat3,
          "current": 0,
          uuid: uuidV1()
      },{
          "tableID": parseInt(id),
          "max": parseInt(faker.random.number(100)),
          "col": "14 uur",
          "row": cat2,
          "current": 0,
          uuid: uuidV1()
      }
    ]
    for(let i = 0; i < cells.length; i++) {
      await pg("cells").insert(cells[i]);
    }
  }

}



module.exports = Schema;
