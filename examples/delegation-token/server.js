var express   = require('express');

var jwt       = require('express-jwt');
var cors      = require('cors');

var app             = express();
var secondaryApp    = express();

var SECRET    = 'gcyGiDHsIE6bUT9oAs6ghuynjt8usUqTRglg8n8eWqw9SgnGJ5cRLCUz03gJ_s_X';
var AUDIENCE  = 'BUIJSW9x60sIHBw8Kd9EmCbj8eDIFxDC';

var authenticate = jwt({
  secret: new Buffer(SECRET, 'base64'),
  audience: AUDIENCE
});

app.use(express.logger());

app.use('/', express.static(__dirname + '/client/'));

app.use('/api', authenticate);

app.get('/api/protected', function (req, res) {
  res.send(200, 'This API Rocks!');
});

app.listen(3000);
console.log('Main application listening on port http://localhost:3000');

var SECONDARY_APP_SECRET    = 'M1IKNcRQDmaLeGfa0IBEDIyFNrDSHTFigbyEUjqcvHub2qrg368gWmwfHYZ9doy5';
var SECONDARY_APP_AUDIENCE  = 'r34d7GotLSGQciOHGHLrJaQo1Zg0cXQb'; // Another App

var authenticateSecondaryApp = jwt({
  secret: new Buffer(SECONDARY_APP_SECRET, 'base64'),
  audience: SECONDARY_APP_AUDIENCE
});

secondaryApp.use(cors());
secondaryApp.use(express.logger());

secondaryApp.use('/api', authenticateSecondaryApp);

secondaryApp.get('/api/protected', function (req, res) {
  res.send(200, 'This API Rocks!');
});

secondaryApp.listen(33000);
console.log('Secondary application listening on port http://localhost:33000');
