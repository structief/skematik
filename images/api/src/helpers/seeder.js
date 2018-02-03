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
      res.send(200)
    })
  }


  async createSchema(pg) {

    const cat1  = faker.random.word(),
      cat2 = faker.random.word(),
      cat3 = faker.random.word()

    // create organisation

    const organisation = {}
    organisation["uuid"] = uuidV1();
    organisation["name"] = faker.company.companyName();
    organisation["created_at"] = new Date()
    organisation["updated_at"] = new Date()



    const createdOrg =  await pg("organisations").insert(organisation).returning('uuid');

    const insertRolesOwner = await pg("roles").insert({
      uuid: uuidV1(),
      organisationID: organisation["uuid"],
      type: "OWNER",
      short: "owner of the organisation",
      permissions: "777"
     }).returning('uuid')
    const insertRolesAdmin = await pg("roles").insert({
      uuid: uuidV1(),
      organisationID: organisation["uuid"],
      type: "ADMIN",
      short: "admin of the organisation",
      permissions: "777"
     }).returning('uuid')
    const insertRolesUser = await pg("roles").insert({
      uuid: uuidV1(),
      organisationID: organisation["uuid"],
      type: "USER",
      short: "user of the organisation",
      permissions: "300"
    }).returning('uuid')
    const insertRolesParticipant = await pg("roles").insert({
      uuid: uuidV1(),
      organisationID: organisation["uuid"],
      type: "PARTICIPANT",
      short: "participant of the organisation",
      permissions: "300"
    }).returning('uuid')


  //create users


    const adminUser = await pg("users").insert({
      uuid: uuidV1(),
      organisation: organisation["uuid"],
      roles: { roles: [ {"uuid": insertRolesOwner[0]},  {"uuid": insertRolesAdmin[0]}, ]},
      username: faker.internet.userName(),
      usermail: faker.internet.email(),
      password: faker.internet.password(),
      given_name: faker.name.firstName(),
      family_name: faker.name.lastName()
    }).returning('uuid')


    for(let i = 0; i<Math.random()*10; i++) {

      await pg("users").insert({
        uuid: uuidV1(),
        organisation: organisation["uuid"],
        roles: { roles: [  {"uuid": insertRolesUser[0]}, ]},
        username: faker.internet.userName(),
        usermail: faker.internet.email(),
        password: faker.internet.password(),
        given_name: faker.name.firstName(),
        family_name: faker.name.lastName()
      }).returning('uuid')

    }

    for(let i = 0; i<Math.random()*10; i++) {

      await pg("users").insert({
        uuid: uuidV1(),
        organisation: organisation["uuid"],
        roles: { roles: [  {"uuid": insertRolesParticipant[0]}, ]},
        username: faker.internet.userName(),
        usermail: faker.internet.email(),
        password: faker.internet.password(),
        given_name: faker.name.firstName(),
        family_name: faker.name.lastName()
      }).returning('uuid')

    }

    //add first one as creator, and make admin



    console.log(insertRolesParticipant, insertRolesUser)
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
      "creator": adminUser[0],
      published: 1
    }
    vals['rows'][cat1] = faker.lorem.sentence();
    vals['rows'][cat2] = faker.lorem.sentence();
    vals['rows'][cat3] = faker.lorem.sentence();


    const id = await pg('schema').insert(vals).returning('id');

    // add cells to the schema that has been created

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

    //add user

  }

}



module.exports = Schema;
