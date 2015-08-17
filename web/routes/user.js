var express = require('express');
var router = express.Router();

//var logger = require('morgan');
//router.use(logger('short'));

module.exports = function (passport) {
    var authenticateLocal = passport.authenticate('local', {
        failureRedirect: 'user/login'
    });

    router.get('/', function(req, res, next) {
        res.render('user/login', {
            title: 'Express'
        });
    });
    router.get('/login', require('./user/login').get);
    router.get('/new', function(req, res, next) {
        res.render('user/registration', {
            title: 'Express'
        });
    });

    router.post('/new', require('./user/registration').post);
    router.post('/login', authenticateLocal, require('./user/login').post);
    router.post('/logout', require('./user/logout').post);

    return router;
};

