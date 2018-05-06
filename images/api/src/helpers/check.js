// -1 (some delays), 0 (down) or 1 (up and running)
const request = require('request');

exports.checkCalls = async (res, pg) => {
  const status = [
    {
      "name": "API",
      "url": "http://localhost:3000/",
      "status": -1,
      "info": "-"
    },
    {
      "name": "FRONT",
      "url": "http://localhost:3000/",
      "status": -1,
      "info": "-"
    },
  ]
  status.forEach(async (check) => {

    request(check.url, function (error, response, body) {
      
      if(body) {
        check.status = 1
      }
      if(error) {
        check.status = 0
        check.info = error;
      }

    });
  });
  status.push(
    {
      "name": "STORE",
      "url": 'http://db:5432/',
      "status": -1,
      "info": "-"
    }
  )
  await pg.raw('select 1+1 as result').then(function () {
    console.log('init')

    status[2].status = 1;
    status[2].info= '-';
  });

  setTimeout(() => {
    res.status(200).send(status);
  }, 2000)
}
