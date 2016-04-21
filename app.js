var express = require('express');
var path = require('path');
var bodyParser = require('bodyParser'); // check this, I think you only need it if your passing in Json?
var fs = require('fs');
var request = require('superagent')

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html'); // send file to client
});

app.get('/results', function(req, res){
  res.sendFile(__dirname + '/views/index.html'); // send file to client
});

app.get('/', function(req, res) {

})

app.post('tweets', function(req,res) {

  }



modules.export = app;
