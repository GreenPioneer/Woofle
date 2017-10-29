'use strict';

exports.all = all;
exports.addFavorite = addFavorite;
exports.deleteFavorite = deleteFavorite;
exports.showFavorites = showFavorites;

const _ = require('lodash');
const User = require('../user/user.model');
const path = require('path');

function all(req, res, next) {
  User.getByEmail(req.user.email)
    .then((user) => {
      res.json(user.favorites);
    })
    .catch(err => next(err));
}

function addFavorite(req, res, next) {
  User.getByEmail(req.user.email)
    .then((user) => {
      user.favorites.push(req.params.breedName);
      user.favorites = _.uniq(user.favorites);
      return user.save();
    })
    .then((savedUser) => {
      return res.json(savedUser.favorites);
    })
    .catch(err => next(err))
}

function deleteFavorite(req, res, next) {
  var breedName = req.params.breedName;
  User.getByEmail(req.user.email)
    .then((user) => {
      const breedIndex = user.favorites.indexOf(breedName);
      if (breedIndex !== -1) {
        user.favorites.splice(breedIndex, 1);
      }
      return user.save();
    })
    .then((savedUser) => {
      return res.json(savedUser.favorites);
    })
     .catch(err => next(err))
}
// did you solve with public statics?
function showFavorites (req, res, next) {
  res.sendFile(path.resolve('public/favoritespage/favorites.html'));
}
