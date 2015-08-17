var log = require('lib/log')(module);

exports.get = function (req, res) {
    var user = req.user,
    getUsers = require('user/getAllUsers');

    getUsers(null, function (err, users) {
        if (err) return next(err);
        res.json({
            success: true,
            users: users
        });
    });
};