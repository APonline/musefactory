import { createWriteStream, readFileSync } from 'fs';
const nodemailer = require('nodemailer');
const SMTPServer = require("smtp-server").SMTPServer;

// MAIL
const mailServer = new SMTPServer({
    secure: true,
    key: readFileSync("musefactory.app.key"),
    cert: readFileSync("musefactory.app.crt")
});
mailServer.listen(465);
mailServer.on("error", err => {
    console.log("Error %s", err.message);
  });

//const toExchange = getMX(parsed.to);
let transporter = nodemailer.createTransport({sendmail: true},{
    from: 'noreply@musefactory.app',
    port: 25,
});
  

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