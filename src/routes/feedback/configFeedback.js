const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');

const auth ={
    auth : {
        api_key:'api key here',
        domain:'domain key here'
    }
}

const transporter = nodemailer.createTransport(mailgun(auth));

const sendMail = (email,subject,text,cb) => {
    const mailOptions = {
        from: email,
        to: 'email here',
        subject,
        text
    };

    transporter.sendMail(mailOptions, function(err,data){
        if(err) {
            cb(err,null);
        }
        else{
            cb(null,data);
        }

    });
}

module.exports = sendMail;