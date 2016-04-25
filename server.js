var setup = require('./setup.js')
var app = setup.app
var knex = setup.knex
var bcrypt = setup.bcrypt


function listTweets(){
  return knex.raw('SELECT * FROM "tweet"' )
}

function addTweet (tweet, username) {
  // return knex.raw('insert into "tweet" (tweet, name) values ("' + tweet + '", "'+username+'" );')
  return knex.raw('insert into "tweet" (tweet, name) values (?,?);', [tweet, username]) //'I'm saving you from sneaky sql injection attacks!'
}


app.get('/home', function(req, res) { // grab data from database and render onto page
  listTweets()
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

app.post('/', function (req, res) {
  var hash = bcrypt.hashSync(req.body.password, 10);
  console.log("name", req.body.name)
  knex('tweet').insert({name: req.body.name, password: hash}) // Store hash in your password DB.
   .then(function(data){
    // req.session.id = data //try person id
    res.redirect('/home')
    console.log("successful", data)
    })
  .catch(function(error){
    console.log('Error', error)
    req.session.userId = 0
    res.redirect('/')
  })
});

app.get('/sign-in', function (req, res) {
  res.render('sign-in')
})

app.post('/sign-in', function (req, res) {
  //look in req.body for the params sent from the form
  knex('tweet').where({ name: req.body.name }).then(function(tweet){
    var authenticatedUser = false
    users.map(function(user){
      if (bcrypt.compareSync(req.body.password, user.password_hash)) {
        authenticatedUser = true
        req.session.userId = user.id
      }
    })
    if (authenticatedUser){
      res.redirect('/home')
    } else {
      res.redirect('/sign-in')
      res.send("Incorrent details, please try again")
    }
  })
})



// spelling :-)
module.exports = app;
