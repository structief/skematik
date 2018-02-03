const jwt = require("jwt-simple");



exports.checkToken = (pg, token, next, res) => {
  const t = token.split(' ')[1];

  const decoded = jwt.decode(t, 'secret');
  if(decoded.expiresAt > new Date().getTime()) {
    next(decoded);
  } else {
    res.send(400)
  }


  // pg.select().table("tokens").where({
  //   token: t
  // }).then((r) => {
  //   console.log(r)
  //   next(r)
  // })
}

