const express = require('express');
const router = express.Router();
const serverRouter = require('./../../server');
const nodemailer = require('nodemailer');


router.post('/addfaculty', function (req, res) {
    let fno = req.body.fno;
    let name = req.body.name;
    let gender = req.body.gender;
    let email = req.body.email;
    let phone = req.body.phone;
    console.log(fno,name,gender,email,phone);
    serverRouter.connection.query(`insert into faculty_list values(${fno}, '${name}', '${gender}', '${email}', '${phone}')` , function (err, result) {
        console.log(result);
        if (err) {
            throw err;
            //return res.end('Error Occurred while inserting record!');
        }
        else{
            console.log('Successfully entered faculty details');
            let sql = `INSERT INTO faculty_login values (${fno},'${name}', '${name}')`;
            serverRouter.connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
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
                subject: 'New faculty Added',
                text: 'You have been successfully added to the faculty database. The username given for your login is '+ name +' . Click the following link to reset your password so that you can login. '+ ' http://34.121.14.80:/reset_pass.html'
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.redirect('http://34.121.14.80:/faculty_success.html');
        }
    });
});

router.post('/removefaculty', function (req, res) {
    let fno = req.body.fno;
    serverRouter.connection.query(`delete from faculty_list where fno = ${fno}` , function(err, result){
        console.log(err);
        if (err) {
            return res.end('Error Occurred while deleting record!');
        }
        else{
            console.log('Successfully deleted faculty from database');
            let sql = `delete from faculty_login where fno = ${fno}`;
            serverRouter.connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record deleted");
            });
            res.redirect('http://34.121.14.80:/Rem_fac_success.html');
        }
    });
});

router.post('/addcourse', function (req, res) {
    let code = req.body.code;
    let cred = req.body.cred;
    let cname = req.body.cname;

    console.log(code,cname);
    serverRouter.connection.query(`insert into course_list values('${code}','${cred}','${cname}')` , function (err, result) {
        console.log(result);
        if (err) {
            return res.end('Error Occurred while inserting record!');
        }
        else{
            return res.end('Successfully entered course details');
        }
    });
});
router.post('/removecourse', function (req, res) {
    let code = req.body.code;
    serverRouter.connection.query(`delete from course_list where code = '${code}'` , function(err, result){
        console.log(err);
        if (err) {
            return res.end('Error Occurred while deleting record!');
        }
        else{
            return res.end('Successfully deleted course from database');
        }
    });
});

module.exports = router;