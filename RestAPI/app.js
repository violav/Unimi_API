require('rootpath')();
const express = require('express');
const app = express();
require('./db');
const httpStatus = require('./lib/httpStatus')
const bodyParser = require('body-parser')

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.get('/api/v1', function (req, res) {
  res.status(httpStatus.OK).send('API v1 running');
});

const userController = require('controllers/userController');
app.use('/api/v1/users', userController);

const authController = require('controllers/authController');
app.use('/api/v1/authentication', authController);

const roomController = require('controllers/roomController');
app.use('/api/v1/rooms', roomController);

const meetingController = require('controllers/meetingController');
app.use('/api/v1/meeting', meetingController);

module.exports = app;
