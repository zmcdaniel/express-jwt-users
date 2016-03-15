var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost:27017/myauthenticatedusers');

app.use(bodyParser.urlencoded({extended:true}));
app.use('/api/users', require('./controllers/users'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(3000);
