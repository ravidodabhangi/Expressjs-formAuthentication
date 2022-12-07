let LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const authSchema = require("../Model/Auth");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        let user = await authSchema.findOne({ email });
        //user exists or not
        if (!user) {
          return done(null, false, {
            message: "user not exits in our records",
          });
        }
        //password is match or not
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            return done(null, false, { message: "password is not matched" });
          } else {
            return done(null, user);
          }
        });
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  }); //persist data
  passport.deserializeUser(function (id, done) {
    authSchema.findById(id, function (err, user) {
      done(err, user);
    });
  }); //get data from session
};
