var log = require('lib/log')(module);

exports.post = function (req, res) {
    var user = req.user;

    res.json(user);
};
