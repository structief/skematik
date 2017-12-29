const uuidV1 = require('uuid/v1');
const bcrypt = require('bcryptjs');
const jwt = require("jwt-simple");
const Identicon = require("identicon.js");
const {checkToken} = require("./helpers/auth")


class Auth {

  constructor() {
    this.comparePass = this.comparePass.bind(this);
    this.createUser = this.createUser.bind(this);
    this.assignFields = this.assignFields.bind(this);
    this.verifyToken = this.verifyToken.bind(this);
  }

  comparePass(userPassword, databasePassword) {
    //return bcrypt.compareSync(userPassword, databasePassword);
    return (userPassword == databasePassword);
  }

  assignFields(app, pg) {

    app.get('/tokenCheck/:token', async(req, res, next) => {
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
      console.log(req.query.path.includes("/admin/"), req.query.path)
      if(req.headers.authorization) {
        checkToken(pg, req.headers.authorization, async (result) => {
          if(result.length > 0) {
            console.log(result);
            pg.select().table('users').where({ uuid: result[0].user }).then((data) => {
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
          } else {

            if(req.query.path.includes("/admin/")) {
              res.send(401, {message: "Please log in, invalid token"}); 
            }
            else {
              res.send(200, {});
            }
          }
        })
      } else {
        if(req.query.path.includes("/admin/")) {
          res.send(401, {message: "Please log in, no token found"}); 
        }
        else {
          res.send(200, {}); 
        }
      }
    })

    app.post('/login',  async (req, res, next) => {
      pg.select().table("users").where({"username": req.body.username}).then((result) =>{
        if(result.length > 0) {

          if(this.comparePass(req.body.password, result[0].password)) {

            const token = jwt.encode(req.body.username, "xxx");
            console.log(result[0])
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
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt);
    const uuid = uuidV1();
    return pg('users')
      .insert({
        uuid: uuid,
        username: req.body.username,
        password: hash,
        usermail: req.body.usermail
      })
      .returning('*');
  }
}

module.exports = Auth;



