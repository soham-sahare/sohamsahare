const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');

// Email configuration for Outlook/Hotmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'hotmail', // Use 'hotmail' for Outlook.com accounts
    auth: {
      user: process.env.EMAIL_USER || 'your-email@outlook.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Render EJS email template for contact form submissions
const createContactEmailTemplate = async (formData) => {
  const timestamp = new Date().toLocaleString();
  const templatePath = path.join(__dirname, '../views/email-templates/thank-you.ejs');
  
  try {
    const html = await ejs.renderFile(templatePath, {
      formData,
      timestamp
    });
    return html;
  } catch (error) {
    console.error('Error rendering email template:', error);
    // Fallback to simple HTML if template fails
    return `
      <html>
        <body style="font-family: Arial, sans-serif; background: #161616; color: #faf7f6; padding: 20px;">
          <h1>Thank You!</h1>
          <p>Your message has been received. I'll get back to you soon.</p>
          <p><strong>Name:</strong> ${formData.Name || 'Not provided'}</p>
          <p><strong>Email:</strong> ${formData.email || 'Not provided'}</p>
          <p><strong>Message:</strong> ${formData.Message || 'No message provided'}</p>
          <p><strong>Submitted:</strong> ${timestamp}</p>
          <p>Best regards,<br>Soham Sahare</p>
        </body>
      </html>
    `;
  }
};

// Function to send contact form email
const sendContactEmail = async (formData, recipientEmail) => {
  try {
    const transporter = createTransporter();
    
    // Render the EJS template
    const html = await createContactEmailTemplate(formData);
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@outlook.com',
      to: recipientEmail || process.env.EMAIL_USER || 'your-email@outlook.com',
      subject: `Thank you for your message, ${formData.Name || 'there'}!`,
      html: html,
      replyTo: process.env.EMAIL_USER || 'your-email@outlook.com'
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createTransporter,
  createContactEmailTemplate,
  sendContactEmail
};
