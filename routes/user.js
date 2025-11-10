const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js');
const userController = require("../controllers/users.js")

router.route('/signup')
  .get(userController.renderSignupForm)
  .post(wrapAsync( userController.signup));


router.route('/login')
  .get(userController.renderLoginForm)


  //login
  // //passport.authenticate is a middleware that authenticates the request
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
    failureFlash : true,  //to flash error message
    failureRedirect : "/login"  //if login fails redirect to login page
    }),
    userController.login
  );

//logout
router.get("/logout",userController.logout );

module.exports = router;