var ChatModel = require('models/chat').Chat;
var log = require('lib/log')(module);

module.exports = function (user, msg, cb) {
    console.log(user, msg);

    var message = {
        room: 'main',
        username: user,
        message: msg
    };

//    var messageEntry = new ChatModel(message);
//    messageEntry.save(function(err) {
//        if (err) return cb(err);
        cb();
//    });
};