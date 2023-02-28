const express = require('express');
const router = express.Router();

var nodemailer = require('nodemailer');
const { Analytics } = require('@segment/analytics-node')

const analytics = new Analytics({ writeKey: process.env.KEY })

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

    analytics.track({
        anonymousId: 'id',
        event: 'Home Page Visited'
    });

    res.render('index');
})

router.get('/contact', (req, res) => {

    analytics.track({
        anonymousId: 'id',
        event: 'Contact Page Visited'
    });

    res.render('contact');
})

router.post('/contact', (req, res) => {

    let name = req.fields.name
    let email = req.fields.email
    let message = req.fields.message

    email_handler(name, email, message)

    analytics.track({
        anonymousId: 'id',
        event: 'Contact Page - Email sent',
        properties: {
            email: email,
            name: name,
            message: message,
        }
    });

    res.redirect("/contact")
})

router.get('/about', (req, res) => {

    analytics.track({
        anonymousId: 'id',
        event: 'About Page Visited'
    });

    res.render('about');
})

module.exports = router;