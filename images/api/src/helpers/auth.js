const jwt = require("jwt-simple");



exports.checkToken = (min, pg, token, next, res) => {
  const t = token.split(' ')[1];

  const decoded = jwt.decode(t, 'secret');
  let proceed = false;

  console.log(decoded.roles)

  //check auth
  for(let i = 0; i<decoded.roles.length; i++) {
    console.log(parseInt(decoded.roles[i].permissions), parseInt(min))
    if(parseInt(decoded.roles[i].permissions) >= parseInt(min) ) {
      proceed = true;
    }
  }

  if(decoded.expiresAt < new Date().getTime()) {
    proceed =  false
  } 

  if(proceed){
    next(decoded);
  } else {
    res.send(401)
  }


  // pg.select().table("tokens").where({
  //   token: t
  // }).then((r) => {
  //   console.log(r)
  //   next(r)
  // })
}

