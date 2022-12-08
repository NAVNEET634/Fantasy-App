var createError = require('http-errors');
var cookieSession = require('cookie-session')

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var admin = require('./routes/admin');
var addleagues = require('./routes/leagues');
var banner_image = require('./routes/banner_image');
var teams = require('./routes/teams');
var format = require('./routes/format');
var pointssystem = require('./routes/pointssystem');
var matches = require('./routes/matches');
var players = require('./routes/players');
var contests = require('./routes/contests');
var api = require('./routes/api');
var prize_pool = require('./routes/prizepool'); 
var prize_breakup = require('./routes/prize_breakup')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
  name: 'session',
  keys: ['fantasyApp'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin',admin);
app.use('/leagues',addleagues);
app.use('/banner_image',banner_image);
app.use('/teams',teams);
app.use('/format',format);
app.use('/pointssystem',pointssystem);
app.use('/matches',matches);
app.use('/players',players);
app.use('/contests',contests);
app.use('/api',api);
app.use('/prize_pool',prize_pool);
app.use('/prize_breakup',prize_breakup)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // console.log('s',req.app)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
