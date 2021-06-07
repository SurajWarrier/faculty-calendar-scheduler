const express = require('express');
const router = express.Router();
const serverRouter = require('./../../server');



router.get('/calendar', function(req, res) {
    res.render('calendar');
})

router.get('/getEvents', function(req, res) {
    serverRouter.connection.query(`select * from calendar_events where calno like '${curUserId}'`, function(err, events) {
        if (err) throw err;
        else {
            //events = JSON.parse(JSON.stringify(events));
            console.log(curUserId);
            console.log(events);
            //return {title: events.title, start: events.start, end: events.end}
            return res.json(events);
        }
    });
})

router.post('/addEvents', function(req, res) {
    console.log(req.body);
    let title = req.body.title;
    let start = toMysqlFormat(new Date(req.body.start));
    let end = toMysqlFormat(new Date(req.body.end));
    serverRouter.connection.query(`insert into calendar_events (calno, title, start, end) values(${curUserId}, '${title}', '${start}', '${end}')`, function(err, result) {
        if (err) throw err;
        else {
            return res.json(result);
        }
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