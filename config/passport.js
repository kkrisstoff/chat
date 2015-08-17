var log = require('lib/log')(module),
    LocalStrategy = require('passport-local').Strategy,
    User = require('models/user').User;

module.exports = function (passport) {
    function findUserById (id, callback) {
        User.findById(id, function (err, user) {
            callback(err, user);
        });
    }

    //serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser (function (id, done) {
        findUserById(id, function (err, user) {
            done(err, user);
        });
    });

    //Local Strategy
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {
            User.findOne({username: username},
            function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.checkPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, user.getPublicFields());
            });
        }
    ));

};