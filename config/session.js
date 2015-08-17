var config = require('config');
var sessionStore = require('lib/sessionStore');

module.exports = function () {
    return {
        secret: config.get('session:secret'),

        rolling: true, //forces a cookie reset on response
        cookie: {
            path: "/",
            maxAge: config.get('cookie:maxAge'),
            httpOnly: true // hide from attackers
        },
        key: "sid",
        store: sessionStore
    };
};
