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


module.exports.connection = connection;
module.exports.app = app;