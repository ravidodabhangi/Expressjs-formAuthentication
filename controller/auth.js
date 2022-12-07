const authSchema = require("../Model/Auth");
const bcrypt = require("bcryptjs");
const passport = require("passport");

//get request

const profile = async (req, res) => {
  res.render("profile/user");
};

const registerTemplate = (req, res) => {
  res.render("auth/register");
};

//post request
const registerPost = async (req, res) => {
  let { username, email, password, confirmpassword } = req.body;
  try {
    let errors = [];
    if (!username) {
      errors.push({ text: "username is required" });
    }
    if (!email) {
      errors.push({ text: "email is required" });
    }
    if (!password) {
      errors.push({ text: "password is required" });
    }
    if (password !== confirmpassword) {
      errors.push({ text: "password is not match" });
    }

    if (errors.length > 0) {
      res.render("auth/register", {
        errors,
        username,
        email,
        password,
        confirmpassword,
      });
    } else {
      //first check database user exits or not
      let user = await authSchema.findOne({ email });
      if (user) {
        //old user
        req.flash("ERROR_MSG", "You are already registered. Please log in.");
        res.redirect("/auth/register", 302, {});
      } else {
        //you are new user
        let newUser = new authSchema({
          username,
          email,
          password,
        });
        //generate salt and hash it given string => password
        bcrypt.genSalt(12, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            await newUser.save();
            req.flash("SUCCESS_MSG", "successfully user registered");
            res.redirect("/auth/login", 302, {});
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const loginTemplate = (req, res) => {
  res.render("auth/login");
};

const loginPost = (req, res, next) => {
  //passport strategy
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout(() => {});
  req.flash("SUCCESS_MSG", "successfully logged out");
  res.redirect("/auth/login", 302, {});
};

module.exports = {
  registerPost,
  registerTemplate,
  loginTemplate,
  loginPost,
  logout,
  profile,
};
