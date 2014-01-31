var express   = require('express');
var app       = express();
var jwt       = require('express-jwt');

var SECRET    = 'A92LWsdBgH6legaUm8U3uyJ7n1bdEik7WvO8nQab9LlHTtnawpRx8d-HPqW0b2g-';
var AUDIENCE  = 'DyG9nCwIEofSy66QM3oo5xU6NFs3TmvT';

var authenticate = jwt({
  secret: new Buffer(SECRET, 'base64'),
  audience: AUDIENCE
});

app.use(express.logger());

app.use('/', express.static(__dirname + '/'));

app.use('/api', authenticate);

app.get('/api/protected', function (req, res) {
  res.send(200, 'This API Rocks!');
});

/** For custom signup example **/

var Auth0 = require('auth0');
var extend = require('xtend');

var api = new Auth0({
  domain:       'contoso.auth0.com',
  clientID:     'DyG9nCwIEofSy66QM3oo5xU6NFs3TmvT',
  clientSecret: SECRET
});

var CONNECTION = 'Username-Password-Authentication';

app.use(express.bodyParser());

app.use('/custom-signup', function (req, res) {
  var data = extend(req.body, {connection: CONNECTION, email_verified: false});

  api.createUser(data, function (err) {
    if (err) {
      console.log('Error creating user: ' + err);
      res.send(500, err);
      return;
    }

    res.send(200);
    return;
  });
});

/** ------------------------ **/

app.listen(1337);
console.log('listening on port http://localhost:1337');
