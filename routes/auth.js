const express = require("express");
const { ensureAuthenticated } = require("../helper/auth_helper");
const {
  registerPost,
  registerTemplate,
  loginTemplate,
  loginPost,
  logout,
  profile,
} = require("../controller/auth");
const router = express.Router();
router.get("/register", registerTemplate);
router.get("/login", loginTemplate);
router.get("/logout", logout);
router.get("/profile", ensureAuthenticated, profile);

router.route("/register").post(registerPost);
router.route("/login").post(loginPost);

module.exports = router;
