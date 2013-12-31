var express = require('express');
var app     = express();
var jwt     = require('express-jwt');

app.use(express.logger());
app.use('/', express.static(__dirname + '/app'));

app.get('/protected',
  jwt({secret: 's3cret!'}),
  function (req, res) {
    if (!req.user) {
      return res.send(401);
    }
    res.send(200, {data: 'private data'});
  });

app.listen(3000);
console.log('listening on port 3000');
