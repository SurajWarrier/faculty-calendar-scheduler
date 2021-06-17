const express = require('express');
const app = express();
const path = require("path");
const ejs = require('ejs');
const mysql = require('mysql');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public'))

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    port: "3306",
    database: "mydb"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to DB");
});


//const connection = require('./dbconfig');

const loginRouter = require('./routes/logins/login');
const addRemoveRouter = require('./routes/addremove/add.remove');
const calendarRouter = require('./routes/calendar/mainCalendar');
const schedulerRouter = require('./routes/adminScheduler/schedule');
const resetPwdRouter = require('./routes/passwordReset/pwdreset');
const viewFCRouter = require('./routes/viewFacultyCourse/viewFC');
const feedbackRouter = require('./routes/feedback/sendFeedback');

//app.use(connection);
app.use(express.static(path.join(__dirname, '/public')))
app.use(loginRouter);
app.use(addRemoveRouter);
app.use(calendarRouter);
app.use(schedulerRouter);
app.use(resetPwdRouter);
app.use(viewFCRouter);
app.use(feedbackRouter);
module.exports.connection = connection;
module.exports.app = app;
