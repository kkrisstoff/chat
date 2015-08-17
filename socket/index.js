var log = require('lib/log')(module);
var config = require('config');
var connect = require('connect');
var async = require('async');
var cookie = require('cookie');
var sessionStore = require('lib/sessionStore');
var HttpError = require('error').HttpError;
var User = require('models/user').User;

var cookieParser = require('cookie-parser');



function loadSession(sid, callback) {
    sessionStore.load(sid, function (error, session) {
        if(arguments.length == 0){
            //=> no session
            return callback(null, null);
        } else {
            return callback(null, session)
        }
    })
}

function loadUser(session, callback) {
    var user = session.passport.user;
    if (!user) {
        log.debug("Session %s is anonymous", session.id);
        return callback(null, null);
    }

    log.debug("retrieving user ", user);

    User.findById(user, function (err, user) {
        if (err) return callback(err);

        if (!user) return callback(null, null);
        log.debug("user findById result: ", user.username);
        callback(null, user);
    })
}

module.exports = function (server) {
    var io = require('socket.io')(server);
    var userStorage = null,
        sessionStorage = null;
    //io config
    //io.set('origins', 'localhost:*');
//    io.set('authorization', function (handshake, callback) {
//        log.info("authorization");
//
//        async.waterfall([
//            function (callback) {
//                handshake.cookies = cookie.parse(handshake.headers.cookie || '');
//                var sidCookie = handshake.cookies[config.get('session:key')];
//                var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));
//
//                loadSession(sid, callback);
//            },
//            function (session, callback) {
//                if (!session){
//                    callback(new HttpError(401, "No session"));
//                }
//                sessionStorage = session;
//                //handshake.session = session;
//                loadUser(session, callback);
//            },
//            function (user, callback) {
//                if (!user){
//                    callback(new HttpError(403, "Anonymous session may not connect"));
//                }
//                userStorage = user;
//                //handshake.user = user.username;
//                callback(null)
//            }
//        ],
//        function (err) {
//            if (!err) return callback(null, true);
//
//            if (err instanceof HttpError) return callback(null, false);
//
//            callback(err);
//        })
//    });

    io.use(function(socket, next) {
        var handshakeData = socket.request;
        console.log("!!authorization");
        async.waterfall([
                //get cookie and load session
                function (callback) {
                    handshakeData.cookies = cookie.parse(handshakeData.headers.cookie || '');
                    var sidCookie = handshakeData.cookies[config.get('session:key')];

                    var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));
                    //console.log(sid);
                    loadSession(sid, callback);
                },
                function (session, callback) {
                    if (!session){
                        callback(new HttpError(401, "No session"));
                    }
                    //sessionStorage = session;
                    handshakeData.session = session;
                    loadUser(session, callback);
                },
                function (user, callback) {
                    if (!user){
                        callback(new HttpError(403, "Anonymous session may not connect"));
                    }
                    //userStorage = user;
                    handshakeData.user = user.username;
                    callback(null)
                }
            ],
            function (err) {
                if (!err) return next();//callback(null, true);

                //if (err instanceof HttpError) return callback(null, false);

                //callback(err);
            });
    });


//    io.sockets.on('session.reload', function(sid) {
//        log.info('session.reload');
//        log.info(sid);
//        var clients = io.sockets.clients();
//        clients.forEach(function (client) {
//            log.info(client.handshake.session.id);
//        })
//
//    });

    io.on('connection', function (socket) {
        //console.log(socket.handshake);

        var username = userStorage ? userStorage.username : 'unknown user';
        console.log('!!onConnection');
        console.log(username + 'is connected');

        socket.broadcast.emit('join', username);

        socket.on('message', function(text, cb) {
            console.log(text);
            socket.broadcast.emit('message', username, text);
            cb && cb();
        });

        socket.on('disconnect', function () {
            console.log('user disconnected');
            io.sockets.emit('leave', username);
        })
    });

    return io;
};

