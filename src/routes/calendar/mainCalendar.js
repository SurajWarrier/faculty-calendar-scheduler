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

router.post('/addEvents', function(req, res) {
    console.log(req.body);
    let title = req.body.title;
    let type = "Normal";
    let start = req.body.start;
    let end = req.body.end;
    //let start = toMysqlFormat(new Date(req.body.start));
    //let end = toMysqlFormat(new Date(req.body.end));
    serverRouter.connection.query(`insert into calendar_events (calno, title, type, start, end) values(${curUserId}, '${title}', '${type}', '${start}', '${end}')`, function(err, result) {
        if (err) throw err;
        else {
            return res.json(result);
        }
    })
})

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

router.post('/deleteEvent', function(req, res) {
    console.log(req.body);
    const eno = req.body.eno;
    serverRouter.connection.query(`delete from calendar_events where eno like ${eno}`, function(err, result) {
        if (err) throw err;
        console.log(result);
        console.log("event with id " + eno.toString() + " has been deleted!!!!!!!");
        return result;
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