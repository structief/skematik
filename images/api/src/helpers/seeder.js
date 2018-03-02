const faker = require('faker');
const uuidV1 = require('uuid/v1');


const config = require('./config.js') 
const Cryptr = require('cryptr'),
    cryptr = new Cryptr(config.auth.secret);

class Schema {

  constructor() {
    this.assignFields = this.assignFields.bind(this);
    this.createSchema = this.createSchema.bind(this);
  }

  async assignFields(app, pg) {

    app.get('/faker', async (req, res, next) => {

      const user = await this.createSchema(pg);
      res.send(200, { mail: user })
    })
  }


  async createSchema(pg) {

    const standardPass = 'test'

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

    const mail = faker.internet.email();
    const adminUser = await pg("users").insert({
      uuid: uuidV1(),
      organisation: organisation["uuid"],
      roles: { roles: [ {"uuid": insertRolesOwner[0]},  {"uuid": insertRolesAdmin[0]}, ]},
      mail: mail,
      password: cryptr.encrypt(standardPass),
      given_name: faker.name.firstName(),
      family_name: faker.name.lastName()
    }).returning('uuid')


    for(let i = 0; i<Math.random()*10; i++) {

      await pg("users").insert({
        uuid: uuidV1(),
        organisation: organisation["uuid"],
        roles: { roles: [  {"uuid": insertRolesUser[0]}, ]},
        mail: faker.internet.email(),
        password: cryptr.encrypt(standardPass),
        given_name: faker.name.firstName(),
        family_name: faker.name.lastName()
      }).returning('uuid')

    }

    for(let i = 0; i<Math.random()*10; i++) {

      await pg("users").insert({
        uuid: uuidV1(),
        organisation: organisation["uuid"],
        roles: { roles: [  {"uuid": insertRolesParticipant[0]}, ]},
        mail: faker.internet.email(),
        password: cryptr.encrypt(standardPass),
        given_name: faker.name.firstName(),
        family_name: faker.name.lastName()
      }).returning('uuid')

    }

    //add first one as creator, and make admin



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
      organisationID: organisation["uuid"],
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
    return mail;
    //add user

  }

}



module.exports = Schema;
