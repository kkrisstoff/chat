var addUser = require('user').addUser;

exports.get = function (req, res) {
    res.render('user/new', {
        title: 'New User',
        page: 'user.new'
    });
};

exports.post = function (req, res, next) {
    var username = req.body.username,
        mail = req.body.email || "" ,
        password = req.body.password,
        user = {
            username: username,
            password: password,
            mail: mail
        };
    addUser(user, function (err, user) {
        if (err) return next(err);
        res.redirect('/');
    });
};