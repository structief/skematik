
exports.checkToken = (pg, token, next) => {
  const t = token.split(' ')[1];
  pg.select().table("tokens").where({
    token: t
  }).then((r) => {
    next(r)
  })
}

