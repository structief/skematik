const uuidV1 = require('uuid/v1');
const bcrypt = require('bcryptjs');
const jwt = require("jwt-simple");

class Auth {

  constructor() {
    this.comparePass = this.comparePass.bind(this);
    this.createUser = this.createUser.bind(this);
    this.assignFields = this.assignFields.bind(this);
    this.verifyToken = this.verifyToken.bind(this);
  }

  comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
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

    app.post('/login',  async (req, res, next) => {
      pg.select().table("users").where({"username": req.body.username}).then((result) =>{
        if(result.length > 0) {
          if(this.comparePass(req.body.password, result[0].password)) {
            const token = jwt.encode(req.body.username, "xxx");
            pg.select().table("tokens").then((result2) => {
              if (!result2) {
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
            res.send(401, { message: "username or password does not match or does not exist", status: 401});
          }
        } else {
          res.send(401, { message: "username or password does not match or does not exist", status: 401});
        }
      })

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



