

const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path')


class App {

  constructor(opts) {
    this.start = this.start.bind(this);
    this.app = express();
    this.s = http.Server(this.app);
  }

  /** @inheritdoc */
  async start() {

    const _this = this;


    this.app.use( bodyParser.json() );
    this.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));

    this.app.use(cors({credentials: false, origin: '*'}))
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.use('/bower_components',  express.static(path.join(__dirname, 'public', 'bower_components')));
    this.app.use('/assets',  express.static(path.join(__dirname, 'public', 'assets')));

    this.app.use('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    this.s.listen(3000, () => {
      console.log(`server up and listening on ${3000}`)
    })

  }
}

new App().start();


