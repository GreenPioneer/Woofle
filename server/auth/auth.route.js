'use strict';

const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');

//Allow users to signup
router.route('/signup')
  .get(authController.showSignupForm)
  .post(authController.signup);
  

//Allow users to login
router.route('/login')
  .get(authController.showLoginForm)
  .post(authController.login);

//Allow users to logout
router.route('/logout')
  .post(authController.logout)
  .get(authController.logout);

module.exports = router;
