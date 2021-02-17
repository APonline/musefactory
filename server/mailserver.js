import { createWriteStream, readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();
const nodemailer = require('nodemailer');
const SMTPServer = require("smtp-server").SMTPServer;

// MAIL
/*const mailServer = new SMTPServer({
    secure: true,
    key: readFileSync("musefactory.app.key"),
    cert: readFileSync("musefactory.app.crt")
});
mailServer.listen(465);
mailServer.on("error", err => {
    console.log("Error %s", err.message);
  });

//const toExchange = getMX(parsed.to);
let transporter = nodemailer.createTransport({
    name: 'musefactory.app',
    service: 'gmail',
    auth: {
        user: 'andrewgphillips74@gmail.com',
        pass: 'Milkmilk1!'
    },
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail',
    from: 'noreply@musefactory.app',
    port: 465,
    secure: true,
    host: 'smtp.musefactory.app'
});*/

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
})

const sendMailOut = (sendTo, sendSubject, sendText, sendHtml) => {

    transporter.sendMail(
        { 
            to: sendTo,
            subject: sendSubject,
            text: sendText,
            html: sendHtml
        }, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        }
    );
}
// MAIL ENDS

export default sendMailOut;