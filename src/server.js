const express = require('express');
const app = express();
const mysql = require('mysql');
const multer = require('multer');
const path = require("path");
//let upload = multer({ storage: multer.memoryStorage() });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static('views'))
//app.set('view engine', 'ejs');
//import * as path from "path";

const loginRouter = require('./routes/logins/login');
const addRemoveRouter = require('./routes/addremove/add.remove');

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Kuttans25",
    port: "3306",
    database: "mydb"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to DB");
});

app.use(express.static(path.join(__dirname, '/../public')))
app.use(loginRouter);
app.use(addRemoveRouter);

/*
app.post('/login1', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username,password);
    connection.query(`select * from faculty_login where username like '${username}' and password like '${password}'`, function (err, result) {
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

app.post('/login2', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username,password);
    connection.query(`select * from admin_login where username like '${username}' and password like '${password}'`, function (err, result) {
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


app.post('/addfaculty', function (req, res) {
    let fno = req.body.fno;
    let name = req.body.name;
    let gender = req.body.gender;
    let email = req.body.email;
    let phone = req.body.phone;
    console.log(fno,name,gender,email,phone);
    connection.query(`insert into faclist values(${fno},'${name}','${gender}','${email}',${phone})` , function (err, result) {
        console.log(result);
        if (err) {
            return res.end('Error Occurred while inserting record!');
        }
        else{
            return res.end('Successfully entered faculty details');
        }
    });
});
app.post('/removefaculty', function (req, res) {
    let fno = req.body.fno;
    connection.query(`delete from faclist where F_NO = ${fno}` , function(err, result){
        console.log(err);
        if (err) {
            return res.end('Error Occurred while deleting record!');
        }
        else{
            return res.end('Successfully deleted faculty from database');
        }
    });
});

app.post('/addcourse', function (req, res) {
    let code = req.body.code;
    let cred = req.body.cred;
    let cname = req.body.cname;

    console.log(code,cname);
    connection.query(`insert into courselist values(${code},'${cred}','${cname}')` , function (err, result) {
        console.log(result);
        if (err) {
            return res.end('Error Occurred while inserting record!');
        }
        else{
            return res.end('Successfully entered faculty details');
        }
    });
});
app.post('/removecourse', function (req, res) {
    let code = req.body.code;
    connection.query(`delete from courselist where code = ${code}` , function(err, result){
        console.log(err);
        if (err) {
            return res.end('Error Occurred while deleting record!');
        }
        else{
            return res.end('Successfully deleted faculty from database');
        }
    });
});
*/

module.exports.connection = connection;
module.exports.app = app;