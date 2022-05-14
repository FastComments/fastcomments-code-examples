const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const {setupRoutes} = require('./routes');

const app = express();
app.set('view engine', null); // we just serve index.html and do all the dynamic stuff in client.js

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'client')));
app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

setupRoutes(app, logger);

app.use(function(req, res) {
  res.status(404).send('Not found.')
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

module.exports = app;
