const nodemailer = require('nodemailer');
const { errorFunc } = require('./errorMessage');
const { otpGeneration } = require('./otpGeneration');

// Create a transporter using the SMTP configuration
const mailSender =  (req,res,email,otp)=>{
const transporter = nodemailer.createTransport({
    
  service: 'Gmail', // Change to your email service provider
  auth: {
    user: 'ybajaj2402@gmail.com', // Your email address
    pass: 'momqshnylxeswfcc' // Your email password or an application-specific password
  }
});
// Define the email message
const mailOptions = {
    from: 'ybajaj2402@gmail.com', // Sender's email address
    to: email, // Recipient's email address
    subject: 'Test Email', // Email subject
    text: otp// Email plain text body
  };
  
  // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return errorFunc(res,400,error)
    } else {
      console.log("Sending the Mail");
        return errorFunc(res,200,info)
    }
  });
}

module.exports = {mailSender}