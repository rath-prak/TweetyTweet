var setup = require('./setup.js')
var app = setup.app
var knex = setup.knex
var bcrypt = setup.bcrypt

function listTweets(){
  return knex.raw('SELECT * FROM "Tweet"' )
}


function addTweet (tweet, userId) {
  // return knex.raw('insert into "Tweet" (tweet) values ("'+name+'");')
  return knex.raw('insert into "Tweet" (tweet, userId) values (?,?);', [tweet, userId]) //'I'm saving you from sneaky sql injection attacks!'
}


app.get('/')

app.get('/home', function(req, res) { // grab data from database and render onto page
  listTweets()
  .then(function(data){
   res.render("home", {tweet: data})
 })
});

app.post('/home', function(req, res){
  addTweet(req.body.tweet, req.session.userId) // need to get the session.id
  .then(function(data){
    res.redirect('/home') //'once you've put the data into the db, go back to homepage'
  })
})




app.get('/:id', function(req, res) {

  console.log("ID:", req.params.id)
  console.log("username", req.body.name)
  console.log("tweet", req.params.tweet)

  res.render("user-page", {username: req.session.name})
  //find all tweets with a user with id of (req.params.id)
})


app.get('/', function (req, res) {
  res.render('sign-up')
})

// SIGN UP - ENTER PASSWORD FOR THE FIRST TIME
app.post('/', function (req, res) {
  var hash = bcrypt.hashSync(req.body.password, 10);
  console.log("name", req.body.name, req.body.password)
  knex('User').insert({name: req.body.name, password: hash}) // Store hash in your password DB.
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
  knex('User').where({name: req.body.name}).select('password','id')
  .then(function(data){
    console.log("returning password from sign in page *******",req.body.password)
    console.log("******** returing hash password",data[0].password)
    if(bcrypt.compareSync(req.body.password, data[0].password))
    {
      req.session.userId = data[0].id
      console.log(req.session.userId, "req.session.userid")

      res.redirect('/home')
      console.log("successful")
    } else {
      res.redirect('/')
      console.log("ooops")
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
