const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuidV1 = require('uuid/v1');
const faker = require("faker");

const Schema = require('./src/Schema.js');
const Cells = require('./src/Cells.js');
const Users = require('./src/Users.js');
const Answers = require('./src/Answers.js');
const Organisations = require('./src/Organisations.js');
const Participants = require('./src/Participants.js');
const Auth = require('./src/Auth.js');



const app = express();
const server = http.Server(app);
const PORT = 3000;


class App {

  constructor(opts) {

    this.pg = require('knex')({
      client: 'pg',
      connection: process.env.PG_CONNECTION_STRING,
      searchPath: 'knex,public'
    });

    const _this = this;

    this.pg.raw('select 1+1 as result').then(function () {
      _this.initialiseTables();
    });


    this.start = this.start.bind(this);

    this.app = express();
    this.s = http.Server(this.app);
  }

  async start() {

    app.use( bodyParser.json() );       // to support JSON-encoded bodies

    app.use(cors({credentials: false, origin: '*'}))



    app.get('/', async (req, res, next) => {
      const result = {};

      await this.pg.select().table("schema").then(function(r) {
        result["schema"] = r;
      })
      await this.pg.select().table("cells").then(function(r) {
        result["cells"] = r;
      })
      await this.pg.select().table("answers").then(function(r) {
        result["answers"] = r;
      })

      res.send(result)``
    })

    new Schema().assignFields(app, this.pg);
    new Cells().assignFields(app, this.pg);
    new Auth().assignFields(app, this.pg);
    new Users().assignFields(app, this.pg);
    new Answers().assignFields(app, this.pg);
    new Organisations().assignFields(app, this.pg);
    new Participants().assignFields(app, this.pg);

    server.listen(PORT, () => {
      console.log(`server up and listening on ${PORT}`)
    })

  }

  async initialiseTables() {

    await this.pg.schema.createTableIfNotExists('schema', function (table) {
      table.increments();
      table.uuid("uuid");
      table.string('title');
      table.json('headers');
      table.json('rows');
      table.dateTime("opens");
      table.dateTime("closes");
      table.string("creator");
      table.timestamps();
    }).then(function() {
      console.log("created tables")
    });

    await this.pg.schema.createTableIfNotExists('cells', function (table) {
      table.increments();
      table.integer("tableID");
      table.string("col");
      table.string("row");
      table.integer("max");
      table.integer("current");
      table.uuid("uuid");
    }).then(function() {
      console.log("created cells")
    });

    await this.pg.schema.createTableIfNotExists('answers', function (table) {
      table.increments();
      table.uuid("cellID");
      table.uuid("userID");
      table.uuid("tableID");
      table.string("username");
      table.string("usermail");
      table.timestamps();
    }).then(function() {
      console.log("created answers")
    });

    await this.pg.schema.createTableIfNotExists('organisations', function (table) {
      table.increments();
      table.uuid("uuid");
      table.string("name");
      table.uuid("owner");
      table.string("mainPhone");
      table.string("mainAddress");
      table.string("billInfo");
      table.timestamps();
    }).then(function() {
      console.log("created organisations")
    });

    await this.pg.schema.createTableIfNotExists('users', function (table) {
      table.increments();
      table.uuid("uuid");
      table.uuid("organisation");
      table.string('username').unique().notNullable();
      table.string('password').notNullable();
      table.string("usermail");
      table.timestamps(true, true);
    }).then(function() {
      console.log("created users")
    });


    await this.pg.schema.createTableIfNotExists('participants', function (table) {
      table.increments();
      table.uuid("uuid");
      table.uuid("user");
      table.uuid("schema");
      table.string("token");
      table.dateTime("expires_on");
      table.timestamps(true, true);
    }).then(function() {
      console.log("created participants")
    });


    await this.pg.schema.createTableIfNotExists('tokens', function (table) {
      table.increments();
      table.timestamps(true, true);
      table.uuid("user");
      table.string("token");
      table.dateTime("expires_on");
    }).then(function() {
      console.log("created tokens")
    });
  }
}
module.exports = App;
