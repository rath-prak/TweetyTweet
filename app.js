var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); // check this, I think you only need it if your passing in Json?
var fs = require('fs');
var request = require('superagent')
var knexConfig = require('./knexfile')
var knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"])
var bcrypt = require('bcrypt');
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

function list(){
  return knex.raw('SELECT * FROM "tweet"' )
}

function addTweet (tweet, username) {
  return knex.raw('insert into "tweet" (tweet, name) values ("' + tweet + '", "'+username+'" );')
  // return knex.raw('insert into "tweet" (tweet, name) values (?,?);', [tweet, username]) //'I'm saving you from sneaky sql injection attacks!'
}

// app.use(session({
//   secret: 'ssshhhhhh! Top secret!',
//   saveUninitialized: true,
//   resave: true,
//   db: knex
// }))

// app.get('/home', function(req, res){
//   if (req.session.userId){
//     res.render('/home', { id: req.session.userId }) // return the user to Tweet page
//   } else {
//     res.redirect('/sign-in') // else redirect to sign in page
//   }
// })

// app.get('/')

app.get('/home', function(req, res) { // grab data from database and render onto page
  list()
  .then(function(data){
   res.render("home", {tweet: data})
 })
});

app.post('/home', function(req, res){
  addTweet(req.body.tweet, req.body.username)
  .then(function(data){
    res.redirect('/home') //'once you've put the data into the db, go back to homepage'
  })
})

app.get('/', function (req, res) {
  res.render('sign-up')
})

// SIGN UP - ENTER PASSWORD FOR THE FIRST TIME
app.post('/', function (req, res) {
  var hash = bcrypt.hashSync(req.body.password, 10);
  console.log("name", req.body.name, req.body.password)
  knex('tweet').insert({name: req.body.name, password: hash}) // Store hash in your password DB.
   .then(function(data){
    // req.session.id = data //try person id
    res.redirect('/home')
    console.log("successful", data)
    })
  .catch(function(error){
    console.log('Error', error)
    req.session.userId = 0
    res.redirect('/sign-in')
  })
});


//SIGN IN - confirm password

app.get('/sign-in', function (req, res) {
  res.render('sign-in')
})

app.post('/sign-in', function (req, res) {
  knex('tweet').where({name: req.body.name}).select('password')
  .then(function(data){
    console.log("returning password from sign in page *******",req.body.password)
    console.log("******** returing hash password",data[0].password)
    if(bcrypt.compareSync(req.body.password, data[0].password))
    {
      res.redirect('/home')
      console.log("successful")
    } else {
      res.redirect('/')
      console.log("ooopse")
    }

    })
  .catch(function(error){
    console.log('Error', error)
    req.session.userId = 0
    res.redirect('/')
  })

})


// spelling :-)
module.exports = app;
