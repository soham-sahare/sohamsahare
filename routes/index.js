const express = require('express');
const router = express.Router();

var nodemailer = require('nodemailer');

async function email_handler(name, email, message) {
    var transporter = await nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = await {
        from: process.env.EMAIL,
        to: email,
        cc: process.env.CCEMAIL,
        subject: "Hey",
        html: '<h1>' + message + '</h1>'
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/contact', (req, res) => {
    res.render('contact');
})

router.post('/contact', (req, res) => {

    let name = req.fields.name
    let email = req.fields.email
    let message = req.fields.message

    email_handler(name, email, message)

    res.redirect("/contact")
})

router.get('/about', (req, res) => {
    res.render('about');
})

module.exports = router;