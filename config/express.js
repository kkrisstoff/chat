var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

module.exports = function (app) {

    app.use(favicon('public/favicon.ico'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use(require('middleware/resExtensions'));

    var sessionConfig = require('config/session')();
    app.use(session(sessionConfig));

};
