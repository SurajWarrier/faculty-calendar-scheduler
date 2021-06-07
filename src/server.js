const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require("path");
const ejs = require('ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public'))

const loginRouter = require('./routes/logins/login');
const addRemoveRouter = require('./routes/addremove/add.remove');
const calendarRouter = require('./routes/calendar/mainCalendar');

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

app.use(express.static(path.join(__dirname, '/public')))
app.use(loginRouter);
app.use(addRemoveRouter);
app.use(calendarRouter);

module.exports.connection = connection;
module.exports.app = app;