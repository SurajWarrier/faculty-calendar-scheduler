const express = require('express');
const router = express.Router();
const sendMail = require('./configFeedback');

router.post('/feedback', (req,res) => {
    const { subject,email,text } = req.body;
    console.log("Data :  " , req.body);

    sendMail(email,subject,text, function(err, data) {
        if(err){
            res.status(500).json({message: 'Internal Server error'});
        } else {
            res.json({message : 'Email Sent'});
        }
    })

});

module.exports = router;