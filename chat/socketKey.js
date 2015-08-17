var async = require('async');
var crypto = require('crypto');
var log = require('lib/log')(module);
var SocketKey = require('models/socketKey').SocketKey;

exports.post = function (req, res, next) {
    console.log("session.id");
    console.log(req.session.id);
    async.waterfall([
        function(callback) {
            crypto.randomBytes(16, callback); //generate random bytes
        },
        function(buffer, callback) {
            var socketKey = buffer.toString('hex');//generate key
            SocketKey.update(
                // overwrite if socketKey exists for this session
                {
                    $or: [
                        {socketKey: socketKey},
                        {sessionId: req.session.id}
                    ]
                },
                {
                    socketKey: socketKey,
                    sessionId: req.session.id
                },
                {
                    upsert: true
                },
                function(err) {
                    if (err) return callback(err);
                    callback(null, socketKey);
                }
            );
        }
    ], function(err, socketKey) {
        //log.debug("socketKey: ", err || socketKey);
        if (err) return next(err);
        res.json({
            success: true,
            socketKey: socketKey
        });
    });
};



