const express = require('express');
const router = express.Router();

const serverRouter = require('./../../server');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');


router.get('/calendar', function(req, res) {
    res.render('calendar');
})

router.get('/getEvents', function(req, res) {
    serverRouter.connection.query(`select * from calendar_events where calno like '${curUserId}'`, function(err, events) {
        if (err) throw err;
        else {
            events = JSON.parse(JSON.stringify(events));
            //console.log(curUserId);
            //console.log(events);
            //return {title: events.title, start: events.start, end: events.end}
            return res.json(events);
        }
    });
})

router.get('/getId', function(req,res) {
    console.log(req.query);
    const title = req.query.title;
    serverRouter.connection.query(`select * from calendar_events where title like '${title}' and calno like ${curUserId}`, function(err, result) {
        if (err) throw err;
        result = JSON.parse(JSON.stringify(result));
        console.log(result);
        return res.json(result);
    })
})



router.get('/getEmail', function(req, res) {
    serverRouter.connection.query(`select * from faculty_list where fno like ${curUserId}`, function(err, result) {
        if (err) throw err;
        result = JSON.parse(JSON.stringify(result));
        console.log(result);
        return res.json(result);
    })
})


router.post('/scheduleAdmin', function(req, res) {
    console.log(req.body);
    let title = req.body.name;
    let calno = req.body.fno
    let type = req.body.type;
    //let start = req.body.sdate.concat('T', req.body.stime);
    //let end = req.body.edate.concat('T', req.body.etime);
    let start = toMysqlFormat(new Date(req.body.sdate.concat('T', req.body.stime)));
    let end = toMysqlFormat(new Date(req.body.edate.concat('T', req.body.etime)));
    serverRouter.connection.query(`insert into calendar_events (calno, title, type, start, end) values(${calno}, '${title}', '${type}', '${start}', '${end}')`, function (err, result) {
        if (err) throw err;
        else {
            console.log("Entered into the database!!!!!!");
            return res.json(result);
        }
    })
});

router.post('/addEvents', function(req, res) {
    console.log(req.body);
    let title = req.body.title;
    let type = "Normal";
    let start = req.body.start;
    let end = req.body.end;
    //let start = toMysqlFormat(new Date(req.body.start));
    //let end = toMysqlFormat(new Date(req.body.end));
    serverRouter.connection.query(`insert into calendar_events (calno, title, type, start, end) values(${curUserId}, '${title}', '${type}', '${start}', '${end}')`, function (err, result) {
        if (err) throw err;
        else {
            let sql = `select email from faculty_list where fno like ${curUserId}`;

            serverRouter.connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log(result[0].email);
                const date = new Date(start);

                const job = schedule.scheduleJob(date.setMinutes(date.getMinutes() - 30), function () {
                    console.log('The world is going to end today.');
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'csea.group7.se@gmail.com',
                            pass: 'QWERTyuiop123'
                        }
                    });

                    let mailOptions = {
                        from: 'csea.group7.se@gmail.com',
                        to: result[0].email,
                        subject: 'Reminder',
                        text: 'You have a meeting titled - ' + title + ' at ' + start + ' . Reminder to attend the meeting'
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    })
                });
            });
            return res.json(result);
        }
    });
});

router.post('/updateEvent', function(req, res) {
    console.log(req.body);
    let eno = req.body.eno;
    let title = req.body.title;
    let start = toMysqlFormat(new Date(req.body.start));
    let end = toMysqlFormat(new Date(req.body.end));
    serverRouter.connection.query(`update calendar_events set title='${title}', start='${start}', end='${end}' where eno like ${eno}`, function(err, result) {
        if (err) throw err;
        else {
            return result;
        }
    })
})

router.post('/removeEvent', function(req, res) {
    console.log(req.body);
    const eno = req.body.eno;
    serverRouter.connection.query(`delete from calendar_events where eno like ${eno}`, function(err, result) {
        if (err) throw err;
        console.log(result);
        console.log("event with id " + eno.toString() + " has been deleted!!!!!!!");
        res.status(200).end();
    })
})



function formatDate(date) {
    let month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();
    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    return [year, month, day].join('-');
}

function toMysqlFormat(date) {
    return formatDate(date) + ' ' + date.toTimeString().split(' ')[0];
}


module.exports = router;