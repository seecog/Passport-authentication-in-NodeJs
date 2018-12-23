var express = require('express');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'))
var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//mongoose start
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/decembertime',()=>{
    console.log('The databse connected')
});
var User = require('./models/user.model');
//mongoose end

//passport start
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username,password : password }, function (err, user) {
        if (err) { return done(err); }
        
        return done(null, user);
      });
    }
  ));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
//passport end
app.get('/', function (req, res) {
    res.render('login');
});

app.post('/', 
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/home');
  });

  app.get('/home',(req,res)=>{
      res.render('home')
  })

  app.get('/contact',(req,res)=>{
    res.render('contact',{user : req.user})
})

app.get('/about',(req,res)=>{
    res.render('about',{user : req.user})
})

app.get('/logout',(req,res)=>{
req.logout();
res.redirect('/')
})

app.post('/users',(req,res)=>{
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.save();
    res.json({
        message : "user saved succesflly"
    })
})


app.listen(3000,()=>{
    console.log('Server starts')
})