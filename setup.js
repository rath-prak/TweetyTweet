var bcrypt = require('bcrypt');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); // check this, I think you only need it if your passing in Json?
var fs = require('fs');
var request = require('superagent')
var knexConfig = require('./knexfile')
var knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"])
var session = require('express-session')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'view')));
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'hbs');

//add server
app.listen(process.env.PORT || 3000, function () {
  console.log('listening on port 3000!');
});

//add sessions
app.use(session({
  secret: 'keyboard cat', //random string
  resave: false,
  saveUninitialized: true
}))

module.exports = {
  app: app,
  knex: knex,
  bcrypt: bcrypt
}
