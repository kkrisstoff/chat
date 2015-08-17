module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //return res.redirect('/login');
        return next(new Error(401, "You aren't authorized."));
    }
};