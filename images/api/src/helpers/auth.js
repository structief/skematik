
exports.checkToken = (pg, token, next) => {
  pg.select().table("tokens").where({
    token: token
  }).then((r) => {
    next(r)
  })
}

