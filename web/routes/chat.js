require('node-jsx').install()

const express = require('express');
const router = express.Router();
const checkAccess = require('middleware/checkAccess');
const log = require('lib/log')(module);

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const ChatModel = require('models/chat').Chat;
const ChatAppComponent = require('web/react/chatView/components/ChatApp.react');

const ChatApp = React.createFactory(ChatAppComponent);

const logger = require('morgan');
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
            messages = [],
            initialState,
            markup;

        for (i = 0; i < l; i++){
            messages.push(data[i].getMessage());
        }
        initialState = {
            currentUser: user,
            messages: messages
        };
        markup = ReactDOMServer.renderToString(
            ChatApp(initialState)
        );

        res.render('chat/chat', {
            title: 'Chat',
            user: userName,
            markup: markup,
            state: JSON.stringify(initialState)
        });
    });
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