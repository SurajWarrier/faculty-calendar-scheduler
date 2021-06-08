const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');

const auth ={
    auth : {
        api_key:'e05d1551d1978745155d2f03c26eeb58-602cc1bf-453e62d7',
        domain:'sandbox3c9bd45d5371464a8c7f5eff902ae0de.mailgun.org'
    }
}

const transporter = nodemailer.createTransport(mailgun(auth));

const sendMail = (email,subject,text,cb) => {
    const mailOptions = {
        from: email,
        to: 'csea.group7.se@gmail.com',
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