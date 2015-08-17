var crypto = require('crypto');
//var Signer = require('./signer').Signer;
var config = require('config');
var log = require('lib/log')(module);
var error = require('error').HttpError;
var async = require('async');

var SocketKey = require('models/socketKey').SocketKey;



exports.retrieveSidBySocketKey = function(sessionStore, socketKey, callback) {
    if (!socketKey) {
        return callback(new HttpError(401, "Invalid socketKey"));
    }

    async.waterfall([
        function(callback) {
            SocketKey.findOne({socketKey: socketKey}, callback);
        },
        function(socketKey, callback) {
            if (!socketKey) return callback(new HttpError(401, "No such socketKey"));
            socketKey.remove(function(err) {
                if (err) return callback(err);
                callback(null, socketKey.get('sessionId'));
            });
        }
    ], callback);
};

