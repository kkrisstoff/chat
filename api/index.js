var express = require('express');
var router = express.Router();
var checkAccess = require('middleware/checkAccess');

module.exports = function (passport) {
    var authenticateLocal = passport.authenticate('local', {
        //failureRedirect: 'user/login/error'
    }/*, function (err, isAuthed, user) {
        //console.log(arguments);
    }*/);

    router.post('/user/newUser', require('./user/registration').post);
    router.post('/user/login', authenticateLocal, require('./user/login').post);
    router.post('/user/logout', require('./user/logout').post);

    router.post('/chat/socketKey', checkAccess, require('chat/socketKey').post);

    router.get('/getFriendsList', checkAccess, require('./friendsList').get);
    return router;
};
