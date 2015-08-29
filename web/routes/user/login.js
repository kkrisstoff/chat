var log = require('lib/log')(module);

var JSX = require('node-jsx').install(),
    React = require('react'),
    UserApp = React.createFactory(require('web/components/user/UserApp.react'));

exports.get = function (req, res) {
    var initialState = {
        view: "login",
        userName: "",
        currentUser: null
    };

    var markup = React.renderToString(
        UserApp(initialState)
    );

    res.render('user/login', {
        title: 'logIn',
        page: 'user.login',
        markup: markup,
        state: JSON.stringify(initialState)
    });
};

exports.post = function (req, res, next) {
    var user = req.user;

    if (!user) {
        //loginFailed(res, next);
    } else {
        res.redirect('/');
    }
};
