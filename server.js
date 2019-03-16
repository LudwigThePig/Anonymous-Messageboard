'use strict';


const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
const auth = require('./routes/auth.js');
const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const helmet = require('helmet');
const mongoose = require('mongoose');
const app = express();
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user-model.js');

app.use('/public', express.static(process.cwd() + '/public'));

app.use(helmet());
app.use(helmet.frameguard({ action: 'sameorigin' }))

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));


// PASSPORT INIT //
/* this will be split into a sepearte file when it is up and running */
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done)=>{
  done(null, user._id);
})
passport.deserializeUser((userId, done)=>{
  User.findById(userId, (err, user) => done(err, user));
})

const local = new LocalStrategy((username, password, done)=>{
  User.findOne({username})
    .then(user => {
      if (!user || !user.validPassword(password)){
        done(null, false, {message: 'Invalid username/password'});
      } else {
        done(null, user)
      }
    })
    .catch(err => done(err));
});

const loggedInOnly = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect("/login");
};

const loggedOutOnly = (req, res, next) => {
  if (req.isUnauthenticated()) next();
  else res.redirect("/");
};

/*
**Example usage of loggedInOnly**
app.get("/", loggedInOnly, (req, res) => {
  res.render("index", { username: req.user.username });
});
*/

app.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

// *** END
// *** PASSPORT
// *** AUTH


//front-end
app.route('/b/:board/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/board.html');
  });
app.route('/b/:board/:threadid')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/thread.html');
  });
app.route('/login')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/login.html');
  });


//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);

    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

mongoose.connect(process.env.MONGO, (err, db)=>{
  if (err){
    console.log(err);
  } else {
    console.log('You are now connected to the database!');
  }
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        const error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for testing
