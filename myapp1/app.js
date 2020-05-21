require('dotenv').config({ path: './env/.env' })
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dbConnect = require('./config/dbConnect')
var UserModel = require('./Models/userModel')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
var passport = require('passport');
var bcrypt = require('bcryptjs');
LocalStrategy = require('passport-local').Strategy;
dbConnect();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(passport.initialize());
app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function (email, password, done) {
    UserModel.findOne({ email: email }, function (err, user) {
      bcrypt.compare(password, user.password, function (err, res) {
        console.log(res);
        if (err) { return done(err); }
        if (res == false) {
          return done(null, false);
        }
        // if (!user.validPassword(password)) {
        //   return done(null, false, { message: 'Incorrect password.' });
        // }
        return done(null, res);
      });

    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  UserModel.findById(id, function (err, user) {
    done(err, user);
  });
});

app.get('/login', function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/private')
  }
  next();
}, function (req, res, next) {
  res.render('login')
})
app.post('/login', passport.authenticate('local', {
  successRedirect: '/private',
  failureRedirect: '/login'
}));
app.get('/private', function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/login")
  }
}, function (req, res) {
  res.json('day la trang private')
})
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});
app.get('/data', function (req, res, next) {
  if (req.session.views) {
    req.session.views++
    res.json(req.session.views)
  } else {
    req.session.views = 1
    res.json('welcome to the session demo. refresh!')
  }
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post('/signup', function (req, res, next) {
  var email = req.body.email,
    password = req.body.password;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      UserModel.create({ email: email, password: hash }).then(function (data) {
        // res.redirect("/api/home");
        res.json({
          error: false,
          data: data
        })
      })
    })
  })
})
console.log(
  (function (n1) {
    return n1
  })(5)
);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
