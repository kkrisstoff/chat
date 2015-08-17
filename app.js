var express = require('express');
var path = require('path');
var errorhandler = require('errorhandler');
var HttpError = require('error').HttpError;
var passport = require('passport');
var log = require('lib/log')(module);

var app = express();

/**
 * Setup view engine
 */
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Setup database
 */
var mongoose = require('lib/mongoose');

/**
 * Setup express application
 */
require('config/express')(app);

//passport config
//use passport session
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

/**
 * Routes
 * @type {router|exports}
 */
var routes = require('./web/routes/index');
var user = require('./web/routes/user')(passport);
var chat = require('./web/routes/chat');
var api = require('api')(passport);
app.use('/', routes);
app.use('/user', user);
app.use('/chat', chat);
app.use('/api', api);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function(err, req, res, next) {
    if (typeof err == 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
//        if (app.get('env') == 'development') {
//            app.use(errorhandler());
//        } else {
            log.error(err);
            var status = err.status || 500;
            err = new HttpError(status);
            res.sendHttpError(err);
//        }
    }
});


// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}
// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});

module.exports = app;