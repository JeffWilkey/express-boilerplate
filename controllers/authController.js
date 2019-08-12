const jwt = require('jsonwebtoken');
const config = require('../config');

const createAuthToken = function (user) {
  return jwt.sign({
    user
  }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

exports.login = (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({
    ...{
      authToken
    },
    ...req.user.serialize()
  });
}

exports.refreshToken = (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({
    authToken
  });
}