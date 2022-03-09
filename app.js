var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const sequelize = require('./models').sequelize;

var app = express();

(async () => {
  try {
    sequelize.sync();
    await sequelize.authenticate();
    console.log('Connection to the database is successfull!');
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
}) ();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//404 error handlers
app.use((req, res, next) => {
  console.log('404 error: Page not found');
  res.status(404).render('error');
});

// global error handler 
app.use((err, req, res, next) => {
  if (err) {
    console.log('Global error handler called', err)
  };
  if (err.status === 404) {
    res.status(404).render('page-not-found', {err});
  } else {
    err.messge = err.message || 'Sorry! We could not find the page your were looking for'
    res.status(err.status || 500).render('error', {err});
  }
});



module.exports = app;
