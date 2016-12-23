require('node-jsx').install();


const React = require('react');
const ReactDOMServer = require('react-dom/server');
const UserAppComponent = require('web/components/user/UserApp.react');

const UserApp = React.createFactory(UserAppComponent);

exports.get = function (req, res) {
    var initialState = {
        view: "login",
        userName: "",
        currentUser: null
    };

    res.render('user/login', {
        title: 'logIn',
        page: 'user.login',
        markup: ReactDOMServer.renderToString(
                UserApp(initialState)
            ),
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
