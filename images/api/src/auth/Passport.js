

const passport = require('passport');
const knex = require('knex');

const pg = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: 'knex,public'
});

module.exports = () => {

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    pg('users').where({id}).first()
      .then((user) => { done(null, user); })
      .catch((err) => { done(err,null); });
  });

};


// const passport = require('images/api/src/auth/Passport');
// const LocalStrategy = require('passport-local').Strategy;
// const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
//
// const User = require('../models/User');
//
//
//
// class PP{
//
//   constructor() {
//     this.passport = passport;
//     this.passport.serializeUser((user, done) => {
//       done(null, user.id);
//     });
//
//     this.passport.deserializeUser((id, done) => {
//       knex('users').where({id}).first()
//         .then((user) => { done(null, user); })
//         .catch((err) => { done(err,null); });
//     });
//
//     this.passport.use(new LocalStrategy(options, (username, password, done) => {
//       // check to see if the username exists
//       knex('users').where({ username }).first()
//         .then((user) => {
//           if (!user) return done(null, false);
//           if (!authHelpers.comparePass(password, user.password)) {
//             return done(null, false);
//           } else {
//             return done(null, user);
//           }
//         })
//         .catch((err) => { return done(err); });
//     }));
//
//   }
//
//
//
// };
//
// module.exports = PP;
//
// /**
//  * Login Required middleware.
//  */
// exports.isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login');
// };
//
// /**
//  * Authorization Required middleware.
//  */
// exports.isAuthorized = (req, res, next) => {
//   const provider = req.path.split('/').slice(-1)[0];
//   const token = req.user.tokens.find(token => token.kind === provider);
//   if (token) {
//     next();
//   } else {
//     res.redirect(`/auth/${provider}`);
//   }
// };
//
//
// //
// // /**
// //  * Tumblr API OAuth.
// //  */
// // passport.use('tumblr', new OAuthStrategy({
// //     requestTokenURL: 'http://www.tumblr.com/oauth/request_token',
// //     accessTokenURL: 'http://www.tumblr.com/oauth/access_token',
// //     userAuthorizationURL: 'http://www.tumblr.com/oauth/authorize',
// //     consumerKey: process.env.TUMBLR_KEY,
// //     consumerSecret: process.env.TUMBLR_SECRET,
// //     callbackURL: '/auth/tumblr/callback',
// //     passReqToCallback: true
// //   },
// //   (req, token, tokenSecret, profile, done) => {
// //     User.findById(req.user._id, (err, user) => {
// //       if (err) { return done(err); }
// //       user.tokens.push({ kind: 'tumblr', accessToken: token, tokenSecret });
// //       user.save((err) => {
// //         done(err, user);
// //       });
// //     });
// //   }
// // ));
// //
// // /**
// //  * Foursquare API OAuth.
// //  */
// // passport.use('foursquare', new OAuth2Strategy({
// //     authorizationURL: 'https://foursquare.com/oauth2/authorize',
// //     tokenURL: 'https://foursquare.com/oauth2/access_token',
// //     clientID: process.env.FOURSQUARE_ID,
// //     clientSecret: process.env.FOURSQUARE_SECRET,
// //     callbackURL: process.env.FOURSQUARE_REDIRECT_URL,
// //     passReqToCallback: true
// //   },
// //   (req, accessToken, refreshToken, profile, done) => {
// //     User.findById(req.user._id, (err, user) => {
// //       if (err) { return done(err); }
// //       user.tokens.push({ kind: 'foursquare', accessToken });
// //       user.save((err) => {
// //         done(err, user);
// //       });
// //     });
// //   }
// // ));
