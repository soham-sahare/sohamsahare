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
        subject: "Thank You for contacting",
        html: "<table border='0' cellpadding='0' cellspacing='0' class='nl-container' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;' width='100%'> <tbody> <tr> <td> <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-1' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'> <tbody> <tr> <td> <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;' width='500'> <tbody> <tr> <td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'> <table border='0' cellpadding='0' cellspacing='0' class='image_block block-1' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'> <tr> <td class='pad' style='width:100%;padding-right:0px;padding-left:0px;'> <div align='center' class='alignment' style='line-height:10px'><img class='big' src='https://media.giphy.com/media/xUA7bdpLxQhsSQdyog/giphy.gif' style='display: block; height: auto; border: 0; width: 480px; max-width: 100%;' width='480' /></div> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-2' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'> <tbody> <tr> <td> <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 500px;' width='500'> <tbody> <tr> <td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'> <table border='0' cellpadding='0' cellspacing='0' class='heading_block block-1' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'> <tr> <td class='pad' style='text-align:center;width:100%;'> <h1 style='margin: 0; color: #555555; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 23px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;'> <span class='tinyMce-placeholder'>SOHAM SAHARE</span> </h1> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-3' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'> <tbody> <tr> <td> <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 500px;' width='500'> <tbody> <tr> <td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'> <table border='0' cellpadding='10' cellspacing='0' class='paragraph_block block-1' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'> <tr> <td class='pad'> <div style='color:#000000;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;'> <p style='margin: 0;'>Thank You so much for contacting, will get back to you shortly.</p> </div> </td> </tr> </table> <table border='0' cellpadding='10' cellspacing='0' class='paragraph_block block-2' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'> <tr> <td class='pad'> <div style='color:#000000;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;'> <p style='margin: 0;'>Name : " + name + "</p> </div> </td> </tr> </table> <table border='0' cellpadding='10' cellspacing='0' class='paragraph_block block-3' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'> <tr> <td class='pad'> <div style='color:#000000;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;'> <p style='margin: 0;'>Email : " + email + "</p> </div> </td> </tr> </table> <table border='0' cellpadding='10' cellspacing='0' class='paragraph_block block-4' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'> <tr> <td class='pad'> <div style='color:#000000;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;'> <p style='margin: 0;'>Message : " + message + "</p> </div> </td> </tr> </table> <table border='0' cellpadding='10' cellspacing='0' class='paragraph_block block-5' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'> <tr> <td class='pad'> <div style='color:#000000;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:16.8px;'> <p style='margin: 0;'><a href='https://sohamsahare.vercel.app/' rel='noopener' style='text-decoration: underline; color: white;' target='_blank'>@sohamsahare</a></p> </div> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-4' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'> <tbody> <tr> <td> <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;' width='500'> <tbody> <tr> <td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'> <table border='0' cellpadding='0' cellspacing='0' class='icons_block block-1' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'> <tr> <td class='pad' style='vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;'> <table cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'> <tr> <td class='alignment' style='vertical-align: middle; text-align: center;'> <!--[if vml]><table align='left' cellpadding='0' cellspacing='0' role='presentation' style='display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;'><![endif]--> <!--[if !vml]><!--> </td> </tr> </table> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody></table>"
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