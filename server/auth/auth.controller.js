'use strict';

exports.showSignupForm = showSignupForm;
exports.signup = signup;
exports.showLoginForm = showLoginForm;
exports.login = login;
exports.logout = logout;

const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../user/user.model');
const path = require('path');

function showSignupForm(req, res, next) {
  res.sendFile(path.resolve('public/authpages/signup.html'));
}

function signup(req, res, next) {
  //look into express validator 
  // https://github.com/greenpioneersolutions/meanstackjs/blob/master/server/modules/users/users.controller.js
  const { email, password } = req.body;
  const requiredFields = ['email', 'password'];
  //taken from the names of the inputs
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      return res.status(400).send(`Missing \`${field}\` in request body`);
    }
  }
  User.findOne({email})
    .then(function(result) {
      if (result !== null) {
        return res.status(400).send(`${email} already in database`);
      }
      User.create({email, password})
      //create is usable even though it isn't a defined function in user.model
      //because .create is a mongoose method. You export the userSchema as a 
      //mongoose based model at the bottom of user.model.js
        .then(user => res.redirect('/auth/login'))
        .catch(err => {
          if (err.code === 11000) {
          // Duplicate key error, already exists
            res.redirect('/auth/login');
            return;
          }
          res.status(500).json({message: 'Internal server error'});
          // res.redirect('/auth/login');
        });
    });
}

function showLoginForm(req, res, next) {
  res.sendFile(path.resolve('public/authpages/login.html'));
}

function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).send();
  }
  User.findOne({email, password})
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).send();
      }
      if (password !== user.password) {
        return res.status(401).send();
      }
      const token = jwt.sign({
        email: user.email,
        id: user.id,
      }, config.JWT_SECRET_KEY);
      // Set a cookie for our auth token.
      res.cookie('woofle-token', token, {maxAge: 9999999});
      res.status(200).send({redirect: '/search'});
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'});
    });
}


function logout(req, res, next) {
  req.user = null;
  res.clearCookie('woofle-token');
  res.redirect('/auth/login');
  //Sets the user to blank, clears the cookie, and resends you to the login page
}
