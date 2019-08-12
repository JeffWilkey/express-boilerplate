'use strict';
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

const localAuth = passport.authenticate('local', {
  session: false
});
// The user provides a username and password to login
router.post('/login', localAuth, authController.login);

const jwtAuth = passport.authenticate('jwt', {
  session: false
});
// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, authController.refreshToken);

module.exports = router;