var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var User = require('./models/user');
var app = express();

var secret = 'superDUPERsecretpassword';

mongoose.connect('mongodb://localhost:27017/myauthenticatedusers');

// Checks for a token and locks down URL to secure endpoint
app.use('/api/users', expressJWT({secret: secret}).unless({method: 'POST'}));
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({message: 'You needed authorization, boy!'});
  }
});

app.use(bodyParser.urlencoded({extended:true}));
app.use('/api/users', require('./controllers/users'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/auth', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if(err || !user) return res.send({message: 'User not found'});
    user.authenticated(req.body.password, function(err, result) {
      if(err || !result) return res.send({message: 'User not authenticated'});
      var token = jwt.sign(user, secret);
      res.send({user: user, token: token});
    });
  });
});

app.listen(3000);
