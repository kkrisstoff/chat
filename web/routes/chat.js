var express = require('express');
var router = express.Router();
var checkAccess = require('middleware/checkAccess');
var log = require('lib/log')(module);

var JSX = require('node-jsx').install(),
    React = require('react'),
    ChatModel = require('models/chat').Chat,
    ChatApp = React.createFactory(require('web/components/ChatApp.react'));


var logger = require('morgan');
router.use(logger('short'));

/* GET home page. */
router.get('/home', checkAccess,  function(req, res, next) {
    var user = req.user,
        userName = user.username;
    res.render('chat/home', {
        title: 'Home',
        user: userName
    });
});
/* GET chat. */
router.get('/', checkAccess,  function(req, res, next) {
    var user = req.user,
        userName = user.username;

    ChatModel.find({}, function (err, data) {
        if (err) return next(err);
        var i, l = data.length,
            messages = [];
        for (i = 0; i < l; i++){
            messages.push(data[i].getMessage());
        }

        //example
        var TodoApp = React.createFactory(require('web/components/TodoApp.react'));

        var markup = React.renderToString(
            //TodoApp()
            ChatApp({
               messages: messages
            })
        );

        res.render('chat/chat', {
            title: 'Chat',
            user: userName,
            markup: markup, //Pass rendered react markup
            state: JSON.stringify(messages) //Pass current state to client side
        });
    });


//    res.render('chat', {
//        title: 'Chat',
//        user: userName
//    });
});
/* GET friends page */
router.get('/friends', checkAccess,  function(req, res, next) {
    var user = req.user,
        userName = user.username,
        getUsers = require('user/getAllUsers');
    getUsers(null, function (err, users) {
        if (err) return next(err);
        res.render('chat/friends', {
            title: 'My Friends',
            user: userName,
            users: users
        });
    });
});

router.post('/socketKey', checkAccess, require('chat/socketKey').post);

router.post('/saveMessage', function (req, res, next) {
    var body = req.body;
    console.log(body);
});
module.exports = router;