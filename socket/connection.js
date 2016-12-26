var async = require('async');
var util = require('util');
var log = require('lib/log')(module);
var connect = require('connect');
var User = require('models/user').User;
var HttpError = require('error').HttpError;
var EventEmitter = require('events').EventEmitter;
var assert = require('assert');//node module
var socketKey = require('lib/socketKey');
var saveMassage = require('chat/saveMessage');

//var Router = require('./router');
var connections = require('./connections');

function Connection(connection, sessionConfig) {
    this.sessionConfig = sessionConfig;
    this.connection = connection;

    connections.addClient(connection);

    this._setStatus(this.CONNECTING);

    connection.on('data', this.onData.bind(this));
    connection.on('close', this.onClose.bind(this));
}

util.inherits(Connection, EventEmitter);

['CONNECTING', 'OPEN', 'CLOSED'].forEach(function(status) {
    Connection.prototype[status] = status;
});

/**
 * handling of all messages. The first one: {type:handshake, sid: ... }
 * Express-session must already exist (generated by page)
 *
 * @param message
 */
Connection.prototype.onData = function(message) {
    //log.info("onData");
    //log.info(message);
    assert.notEqual(this.status, this.CLOSED);

    try {
        message = JSON.parse(message);
    } catch (e) {
        this.close(400, "Message must be JSON");
        return;
    }

    if (this.status == this.CONNECTING) {
        this.onHandshake(message);
    } else if (this.status == this.OPEN) {
        this.onMessage(message);
    }
};


Connection.prototype.onHandshake = function(message) {
//    log.info("onHandshake");
//    log.info(message);
    var self = this;

    if (message.type != 'handshake') {
        this.close(401, "First message must be a handshake");
        return;
    }
    if (!message.socketKey) {
        this.close(401, "First message must contain socketKey");
        return;
    }

    async.waterfall([
        function(callback) {
            socketKey.retrieveSidBySocketKey(self.sessionConfig.store, message.socketKey, callback);
        },
        function(sid, callback) {
            self.loadSessionUser(sid, callback);
        }
    ], function(err) {
        if (err) {
            log.error(err);
            return self.closeOnError(err);
        }

        self._setStatus(self.OPEN);
        self.send({
            type: 'handshake'
        });
        self.broadcast({
            type: 'status',
            username: self.user.username,
            text: 'connected to chat'
        });
        self.emit('open');
    });
};

Connection.prototype.onMessage = function(message) {
    var self = this;
    //log.info("onMessage:");
    //log.info(message);
    async.waterfall([
        function(callback) {
            self.loadSessionUser(self.session.id, callback);
        },
        function(callback) {
            var username = self.user.username,
                text = message.text;

            saveMassage(username, text, function (err) {
                if (!err){
                    self.broadcast({
                        type: 'message',
                        username: username || "unknown user",
                        text: text
                    });
                }
            });
            //self.router.route(message);
        }
    ], function(err) {
        if (err) {
            log.error(err);
            return self.closeOnError(err);
        }
    });
};

Connection.prototype.onClose = function() {
    var self = this;
    connections.removeClientById(this.connection.id);
    this.broadcast({
        type: 'status',
        username: self.user.username,
        text: 'left chat'
    });

    if (this.status != this.CONNECTING) {
        this.emit('close');
    }
    this._setStatus(this.CLOSED);
};
Connection.prototype.close = function(status, message) {
    this.connection.close(status, message);
};

Connection.prototype.send = function(message) {
    console.log("SEND");
    console.log(message);
    this.connection.write(JSON.stringify(message));
};

Connection.prototype.broadcast = function(message) {
    var clients = connections.clients;

    for (var client in clients){
        if (this.connection.id == clients[client].id) continue;

        clients[client].write(JSON.stringify(message));
    }
};

Connection.prototype.closeOnError = function(err) {
    if (err instanceof HttpError) {
        this.close(err.status, err.message);
    } else {
        log.error("closeOnError", err);
        this.close();
    }
};

Connection.prototype.loadSessionUser = function(sid, callback) {
    var self = this;
    //log.debug("loadSessionUser");
    //log.debug(sid);

    async.waterfall([
        function(callback) {
            // express calls are not quite compatible with async here!
            // I get 0 arguments if no session
            // I get 1 argument (error) if error
            // I get 2 arguments (null, session) if ok
            self.sessionConfig.store.load(sid, function(err, session) {

                if (err === undefined) {
                    // no arguments => no session
                    return callback(new HttpError(401, "Session not found"));
                }
                if (err && !session) {
                    // 1 argument => error
                    return callback(err);
                }
                if (session) {
                    self.session = session;
                    return callback();
                }
                callback(new Error("Must never get here"));
            });
        },
        function(callback) {
            if (self.session.passport.user) {
                var user = self.session.passport.user;
                //log.debug("retrieving user ", user);
                User.findById(user, function(err, user) {
                    if (err) return callback(err);
                    //log.debug("user findbyId result: " + user);
                    self.user = user.getPublicFields();
                    callback();
                });
            } else {
                callback(new Error("No user in session"));
            }
        }
    ], callback);
};


Connection.prototype._setStatus = function(status) {
    log.debug("status: ", status);
    this.status = status;
};

exports.Connection = Connection;