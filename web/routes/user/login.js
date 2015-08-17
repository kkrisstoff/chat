var log = require('lib/log')(module);

exports.get = function (req, res) {
    res.render('user/login', {
        title: 'Login',
        page: 'user.login'
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
