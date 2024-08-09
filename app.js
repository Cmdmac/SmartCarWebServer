var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let locateRouter = require('./routes/locate');
let searchRouter = require('./routes/search');


var app = express();
const expressWs = require('express-ws')(app);

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
app.use('/locate', locateRouter);
app.use('/search', searchRouter);

// init websocket
const Router = require('./routes/ws');
app.use('/', Router)

var llmRouter = require('./routes/llm');
app.use('/llm', llmRouter);


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

// app.listen(10000, (req, res) => {
// 	console.log('listen')
// })

module.exports = app;
