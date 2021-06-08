const express = require('express');
const router = express.Router();
const serverRouter = require('./../../server');

router.get('/ViewCourse', function (req, res) {
    serverRouter.connection.query(`select * from course_list`,function(err,result){
        if(err){
            return alert("Unexpected error occured")
        }
        res.render('ViewCourse',{result});
    });
});

router.get('/ViewFaculty', function (req, res) {
    console.log("bruh")
    serverRouter.connection.query(`select * from faculty_list`,function(err,result){
        if(err){
            return alert("Unexpected error occured")
        }
        console.log("bruh1")
        res.render('ViewFaculty',{result});
    });
});

module.exports = router;