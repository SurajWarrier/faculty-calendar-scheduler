const express = require('express');
const router = express.Router();
const serverRouter = require('./../../server');

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
            return res.end('Error Occurred while inserting record!');
        }
        else{
            return res.end('Successfully entered faculty details');
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
            return res.end('Successfully deleted faculty from database');
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