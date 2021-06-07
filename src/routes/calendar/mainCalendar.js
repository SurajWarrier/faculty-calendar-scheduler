const express = require('express');
const router = express.Router();
const serverRouter = require('./../../server');

//const loginRouter = require('./../logins/login')


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
/*
router.post('/addEvents', function(req, res) {
    let calno = req.body.calno;
    let title = req.body.title;
    let start = req.body.start;
    let end = req.body.end;
    serverRouter.connection.query(`insert into calendar_events values(${calno}, ${title}, ${start}, ${end}`, function(err, result) {
        if (err) throw err;
        else {
            return res.status(200).json(result);
        }
    })
})
 */

module.exports = router;