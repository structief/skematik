const uuidV1 = require('uuid/v1');
const jwt = require("jwt-simple");
const Identicon = require("identicon.js");
const { checkToken } = require("./helpers/auth")
const config = require('./helpers/config.js') 
const Cryptr = require('cryptr'),
    cryptr = new Cryptr(config.auth.secret);


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

    app.get('/tokenCheck/:token', async(req, res, next) => {
      console.log(req.params.token)
      await this.verifyToken(pg, req.params.token, (check) => {
        console.log(check)
        if(check) {
          res.send(check)
        } else {
          res.sendStatus(401)
        }
      })
    })

    app.get('/me', async (req, res, next) => {
      // return name, org, and image url
      if(req.query.path.includes("/admin/")) {
        checkToken('000', pg, req.headers.authorization, async (user) => {

          console.log(user);
          pg.select().table('users').where({ uuid: user.uuid }).then((data) => {
            console.log(data)
            if(data.length > 0) {
              res.send({
                username: data[0].username,
                usermail: data[0].usermail,
                organisation: data[0].organisation
              })
            } else {
              if(req.query.path.includes("/admin/")) {
                res.send(401, {message: "No user found with given token"}); 
              }
              else {
                res.send(200, {}); 
              }
            }
          })
        }, res)
      } else{
        res.send(200)
      }
      // } else {
      //   
      //     res.send(401, {message: "Please log in, no token found"}); 
      //   }
      //   else {
      //     res.send(200, {}); 
      //   }
      // }
    })

    app.post('/login',  async (req, res, next) => {
      pg.select().table("users").where({"username": req.body.username}).then( async (result) =>{
        if(result.length > 0) {
          console.log(result[0].uuid)
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
                username: req.body.username,
                givenName: result[0][ 'given_name'],
                familyName: result[0][ 'family_name'],
                roles: roles,
                organisation: org[0],
                expiresAt: expiresAt,
                uuid: result[0].uuid
              }, config.auth.secret);

            // TODO: add expires_at to body
            // 


            pg.select().table("tokens").where({"token": token}).then((result2) => {
              if (!result2.length  > 0) {
                pg("tokens").insert({
                  token: token,
                  user: result[0].uuid
                }).returning("id").then(() => {
                  res.send({
                    token: token
                  })
                })
              } else {
                res.send({
                  token: result2[0].token
                })
              }
            })
          } else {
            res.send(401, { message: "Password incorrect, try again", status: 401});
          }
        } else {
          res.send(401, { message: "Username not recognized in the system", status: 401});
        }
      })

    })


    app.post('/logout',  async (req, res, next) => {
      pg('tokens').del().where({token: req.headers.authorization.split(" ")[1]}).then((data) => {
        res.send(200, data)
      }).catch((error) => { res.sendStatus(401)})

    })

    app.post('/register',  async (req, res, next) => {
      const result = {};

      this.createUser(req, pg).then((result) => {
        res.send(result)
      }).catch((error) => {
        res.send(error)
      })
    })
  }

  async verifyToken(pg, token, resolve) {
    await pg.select().table("tokens").where({token: token}).then((result) => {
      resolve(result)
    })
  }


  createUser (req, pg) {
    console.log("body?", req.body)
    const pswd = cryptr.encrypt(req.body.password);
    console.log(req.body)
    const uuid = uuidV1();
    return pg('users')
      .insert({
        uuid: uuid,
        username: req.body.username,
        password: req.body.password,
        usermail: req.body.usermail
      })
      .returning('*');
  }
}

module.exports = Auth;



