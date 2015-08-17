var mongoose = require('mongoose');
var config = require('config');

//express/mongo session storage
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    url: config.get('db:path'),
    collection: 'sessions'
});

module.exports = sessionStore;