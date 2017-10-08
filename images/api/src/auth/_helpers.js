const bcrypt = require('bcryptjs');

const pg = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: 'knex,public'
});

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createUser (req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return pg('users')
    .insert({
      username: req.body.username,
      password: hash
    })
    .returning('*');
}

module.exports = {
  comparePass,
  createUser
};
