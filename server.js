'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
// auth strategies
const { localStrategy, jwtStrategy } = require('./strategies');

// routers
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

mongoose.Promise = global.Promise;

// config variables
const { PORT, DATABASE_URL } = require('./config');

// initialize app
const app = express();

// middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// authentication
passport.use(localStrategy);
passport.use(jwtStrategy);

// routing
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

// handle 404
app.use('*', (req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

// server
let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => {
      if (err) return reject(err);

      server = app.listen(port, () => {
        console.log(`App listening on port: ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };