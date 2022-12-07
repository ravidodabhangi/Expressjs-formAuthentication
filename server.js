const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");
const { engine } = require("express-handlebars");
const { PORT, MONGODB_URL } = require("./config");
const authRoute = require("./routes/auth");
require("./middlewares/passport")(passport);
let app = express();
mongoose.connect(MONGODB_URL, err => {
  if (err) throw err;
  console.log("database connected");
});

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "shashi",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(flash());
//passport middleware initialize
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.SUCCESS_MSG = req.flash("SUCCESS_MSG");
  res.locals.ERROR_MSG = req.flash("ERROR_MSG");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;

  next();
});

//basic route
app.get("/", (req, res) => {
  res.render("home");
});
//mount route
app.use("/auth", authRoute);

app.listen(PORT, err => {
  if (err) throw err;
  console.log(`server is running on port number ${PORT}`);
});
