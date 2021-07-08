const uuidV1 = require('uuid/v1');
const jwt = require("jwt-simple");
const Identicon = require("identicon.js");
const { checkToken } = require("./helpers/auth")
const config = require('./helpers/config.js') 
const Cryptr = require('cryptr'),
    cryptr = new Cryptr(config.auth.secret);
const emitter = require('./helpers/emitter.js');


class Auth {

  constructor() {
    this.comparePass = this.comparePass.bind(this);
    this.createUser = this.createUser.bind(this);
    this.assignFields = this.assignFields.bind(this);
    this.verifyToken = this.verifyToken.bind(this);
  }

  comparePass(userPassword, databasePassword) {
    const decryptedString = cryptr.decrypt(databasePassword);
    return (userPassword == decryptedString);
  }

  assignFields(app, pg) {

    app.get('/me', async (req, res, next) => {
      // return name, org, and image url
      if(req.query.path.includes("/admin/")) {
        checkToken('000', pg, req.headers.authorization, async (user) => {

          pg.select().table('users').where({ uuid: user.uuid }).then((data) => {
            if(data.length > 0) {
              res.send({
                mail: data[0].mail,
                givenName: data[0].given_name,
                familyName: data[0].family_name,
                organisation: data[0].organisation
              })
            } else {
              if(req.query.path.includes("/admin/")) {
                res.status(401).send( {message: "No user found with given token"}); 
              }
              else {
                res.status(200).send({}); 
              }
            }
          })
        }, res)
      } else{
        res.status(200).send()
      }
    })

    app.post('/login',  async (req, res, next) => {
      pg.select().table("users").where({"mail": req.body.mail}).then( async (result) =>{
        if(result.length > 0) {
          await pg.table('tokens').where( "user", result[0].uuid ).del()

          if(this.comparePass(req.body.password, result[0].password)) {


            const org = await pg.select(['uuid', 'name']).table('organisations').where({uuid: result[0].organisation})

            const roles = []
            for(let i  = 0; i < result[0].roles.roles.length; i++) {
              await pg.select(["type", "permissions", "organisationID"]).table('roles').where({uuid: result[0].roles.roles[i].uuid}).then((r) => {
                roles.push(r[0])
              })
            }
            
            const expiresAt = JSON.stringify(new Date().getTime() + 3*24*60*60*1000);

            const token = jwt.encode(
              { 
                mail: req.body.mail,
                givenName: result[0][ 'given_name'],
                familyName: result[0][ 'family_name'],
                roles: roles,
                organisation: org[0],
                expiresAt: expiresAt,
                uuid: result[0].uuid
              }, config.auth.secret);

            // TODO: add expires_at to body
            // 
            res.send(200, {token: token})

          } else {
            res.send(401, { message: "Password incorrect, try again", status: 401, field: "password"});
          }
        } else {
          res.send(401, { message: "Mail not recognized in the system", status: 401, field: "mail"});
        }
      }).catch(() => { res.send(500)})

    })


    app.post('/logout',  async (req, res, next) => {
      await pg('tokens').del().where({token: req.headers.authorization.split(" ")[1]}).then((data) => {
        res.send(200, data)
      })
      res.sendStatus(401)

    })

    app.post('/register',  async (req, res, next) => {
      await this.createUser(req, pg).then((result) => {
        res.send(200);

        //Send out email for a heads-up to the registrar, which is nice
        emitter.emit('sendgrid.register', result);
      }).catch((error) => {
        res.send(400, error)
      })
    })
  }

  async verifyToken(pg, token, resolve) {
    await pg.select().table("tokens").where({token: token}).then((result) => {
      resolve(result)
    })
  }


  async createUser (req, pg) {

    const uuid = uuidV1();

    const request = {};

    request["uuid"] = uuidV1();
    request["name"] = req.body.organisation.name;
    request["created_at"] = new Date()
    request["updated_at"] = new Date()


    const insert1 =  await pg("organisations").insert(request).returning("uuid");
    const insertRolesOwner = await pg("roles").insert({
      uuid: uuidV1(),
      organisationID: request["uuid"],
      type: "OWNER",
      short: "owner of the organisation",
      permissions: "777"
     }).returning("uuid");
    const insertRolesAdmin = await pg("roles").insert({
      uuid: uuidV1(),
      organisationID: request["uuid"],
      type: "ADMIN",
      short: "admin of the organisation",
      permissions: "777"
     }).returning("uuid")
    const insertRolesUser = await pg("roles").insert({
      uuid: uuidV1(),
      organisationID: request["uuid"],
      type: "USER",
      short: "user of the organisation",
      permissions: "300"
    })
    const insertRolesParticipant = await pg("roles").insert({
      uuid: uuidV1(),
      organisationID: request["uuid"],
      type: "PARTICIPANT",
      short: "participant of the organisation",
      permissions: "300"
    })

    return await pg('users')
      .insert({
        uuid: uuid,
        password: cryptr.encrypt(req.body.account.password),
        mail: req.body.account.mail,
        organisation: insert1[0],
        given_name: req.body.account.givenName,
        family_name: req.body.account.familyName,
        roles: { roles: [{uuid: insertRolesOwner[0]}]}
      }).returning(['uuid', 'mail', 'given_name']);    
  }
}

module.exports = Auth;



