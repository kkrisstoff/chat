var log = require('lib/log')(module);
var User = require('models/user').User;

function getPublicFields(users) {
    var i, l = users.length,
        publicUsers = [];

    for(i = 0; i < l; i++){
        publicUsers.push(users[i].getPublicFields())
    }
    return publicUsers;
}

module.exports = function (opts, callback) {
    var options = opts || {};

    User.find({}, function (err, users) {
        if (err) return callback(err);
        var publicUsers = getPublicFields(users);
        callback(null, publicUsers);
    })
};