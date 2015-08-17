var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        var user = req.user,
            userName = user.username;
        res.render('chat/index', {
            title: 'Express',
            user: userName
        });
    } else {
        res.redirect('user/login');
    }
});

module.exports = router;
