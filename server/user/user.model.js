'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  favorites: [String],
});

userSchema.statics = {
  //Give a Better name instead of a comment
  getByEmail(email) {
    return this.findOne({
      email
    })
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new Error('user does not exist');
        return Promise.reject(err);
      });
  }
};

module.exports = mongoose.model('User', userSchema);
