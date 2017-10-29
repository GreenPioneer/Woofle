'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejwt = require('express-jwt');
const mongoose = require('mongoose');
const {PORT, DATABASE_URL, JWT_SECRET_KEY} = require('./config');
const app = express();

mongoose.Promise = global.Promise;

const authRoutes = require('./server/auth/auth.route');
const userRoutes = require('./server/user/user.route');
const breedRoutes = require('./server/breed/breed.route');
const favoritesRoutes = require('./server/favorites/favorites.route');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



//Authentication middleware provided by express-jwt. If you're not logged in, it says you're unauthorized.
//Otherwise it allows you to access the resource
app.use(ejwt({
  secret: JWT_SECRET_KEY,
  getToken: function fromHeader (req) {
    return req.cookies['woofle-token'] || req.headers['woofle-token'];
  },
}).unless({path: ['/auth/login', '/auth/signup', '/loginsignup.css', '/loginsignup.js', '/']}));

app.use(express.static('public/authpages', {
  extensions: ['html']
}));

app.use(express.static('public/breedpage', {
  extensions: ['html']
}));

app.use(express.static('public/favoritespage', {
  extensions: ['html']
}));

app.use(express.static('public/searchpage', {
  extensions: ['html']
}));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/breeds', breedRoutes);
app.use('/api/favorites', favoritesRoutes);

app.use('/search', function(req, res, next) {
  res.sendFile(path.resolve('public/searchpage/search.html'));
});

app.use('/', function(req, res, next) {
  // So when someone goes to root it redirects to login
  res.sendFile(path.resolve('public/authpages/login.html'));
});

// If we're about to 401, redirect to the login page
app.use(function(err, req, res, next) {
  //debug(err)
  if(401 == err.status) {
    res.redirect('/auth/login');
  }else{
    res.status(500).send('error has happened')
  }
});

let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
