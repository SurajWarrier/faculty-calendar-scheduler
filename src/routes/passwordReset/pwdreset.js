const express = require('express');
const router = express.Router();
const serverRouter = require('./../../server');
const nodemailer = require('nodemailer');


router.post('/f_pass', function (req, res) {
    let email = req.body.email;
    console.log(email);
    serverRouter.connection.query(`select * from faculty_list where email like '${email}'`, function (err, result){
        console.log(result);
        if (err) {
            console.log(err);
            res.redirect('http://34.121.14.80:3000/f_pass_alert.html');
        }
        if (result.length === 0)
            res.redirect('http://34.121.14.80:3000/f_pass_alert.html');
        else {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'csea.group7.se@gmail.com',
                    pass: 'QWERTyuiop123'
                }
            });

            let mailOptions = {
                from: 'csea.group7.se@gmail.com',
                to: email,
                subject: 'Reset Password request',
                text: 'If you want to reset your password click the following link ' + 'http://34.121.14.80:3000/reset_pass.html'
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                    res.redirect('http://34.121.14.80:3000/f_login.html');
                }
            });
        }
    });
});

router.post('/reset', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let cpassword = req.body.cpassword;

    console.log(cpassword,password);
    if (password===cpassword) {
        serverRouter.connection.query(`update faculty_login set password = '${password}' where username like '${username}'`, function (err, result) {
            console.log(result);
            if (err) {
                return res.end('Error Occurred while loggin in!');
            }
            if (result.length === 0)
                res.redirect('http://34.121.14.80:3000/reset_pass_alert.html');
            else
                res.redirect('http://34.121.14.80:3000/pass_success.html');
        });
    }
    else
        res.redirect('http://34.121.14.80:3000/reset_pass_alert.html');

});

module.exports = router;