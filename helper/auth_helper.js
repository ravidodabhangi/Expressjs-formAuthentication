module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("ERROR_MSG", "you are not authorized USER");
      res.redirect("/movies/login", 302, {});
    }
  },
};
