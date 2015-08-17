var log = require('lib/log')(module);
var User = require('models/user').User;

module.exports = function (user, callback) {
    var newUser = new User(user);

    newUser.save(function(err, user, affected) {
        if (err) return  callback(err);
        callback(null, user.getPublicFields());
    });
};