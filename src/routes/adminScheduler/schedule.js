const express = require('express');
const router = express.Router();

const serverRouter = require('./../../server');

router.post('/scheduler', function(req, res) {
    console.log(req.body);
    let title = req.body.name;
    let type = req.body.type;
    let calno = req.body.fno;
    let sDate = req.body.sdate;
    let eDate = req.body.edate;
    let sTime = req.body.stime;
    let eTime = req.body.etime;
    let start = sDate.concat('T', sTime);
    let end = eDate.concat('T', eTime);
    start = toMysqlFormat(new Date(start));
    end = toMysqlFormat(new Date(end));

    serverRouter.connection.query(`insert into calendar_events (calno, title, type, start, end) values(${calno}, '${title}', '${type}', '${start}', '${end}')`, function(err, result) {
        if (err) throw err;
        else {
            res.send("Event entered into the database!!!!!!!")
        }
    })

});

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