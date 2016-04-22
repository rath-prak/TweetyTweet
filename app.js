var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); // check this, I think you only need it if your passing in Json?
var fs = require('fs');
var request = require('superagent')
var knexConfig = require('./knexfile')
var knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"])

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'hbs');

//add server
app.listen(process.env.PORT || 3000, function () {
  console.log('listening on port 3000!');
});

function list(){
  return knex.raw('SELECT * FROM "tweet"' )
}

function addTweet (tweet, username) {
  // return knex.raw('insert into "tweet" (tweet, name) values ("' + tweet + '", "'+username+'" );')
  return knex.raw('insert into "tweet" (tweet, name) values (?,?);', [tweet, username]) //'I'm saving you from sneaky sql injection attacks!'
}


app.get('/', function(req, res) { // grab data from database and render onto page
  list()
  .then(function(data){
   res.render("index", {tweet: data})
 })
});

app.post('/', function(req, res){
  addTweet(req.body.tweet, req.body.username)
  .then(function(data){
    res.redirect('/') //'once you've put the data into the db, go back to homepage'
  })
})



// app.post('tweets', function(req,res) {

// })



// spelling :-)
module.exports = app;
