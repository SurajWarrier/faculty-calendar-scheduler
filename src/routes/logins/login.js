const express = require('express');
const router = express.Router();
const serverRouter = require('./../../server');

router.post('/login1', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username,password);
    serverRouter.connection.query(`select * from faculty_login where username like '${username}' and password like '${password}'`, function (err, result) {
        console.log(result);
        if (err) {
            return res.end('Error Occurred while logins in!');
        }
        if (result.length === 0)
            return res.redirect('http://localhost:3000/alert1.html');
        else
            res.redirect('http://localhost:3000/f_home.html');
    });
});

router.post('/login2', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username,password);
    serverRouter.connection.query(`select * from admin_login where username like '${username}' and password like '${password}'`, function (err, result) {
        console.log(result);
        if (err) {
            return res.end('Error Occurred while logins in!');
        }
        if (result.length === 0)
            return res.redirect('http://localhost:3000/alert.html');
        else
            res.redirect('http://localhost:3000/a_home.html');
    });
});

module.exports = router;