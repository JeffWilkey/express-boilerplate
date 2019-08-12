'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const gravatar = require('gravatar');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
});

userSchema.virtual('gravatar').get(function() {
  return gravatar.url(this.email, {s: '200', r: 'pg', d: 'retro', protocol: 'https' });
});

userSchema.methods.serialize = function() {
  return {
    email: this.email || '',
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    gravatar: this.gravatar || ''
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = User;