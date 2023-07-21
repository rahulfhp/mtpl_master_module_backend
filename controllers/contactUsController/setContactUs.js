const { errorFunc, emailError } = require('../../constraints/errorMessage')
const ContactUs = require('../../model/ContactUsModel')
const emailValidator = require("email-validator");
const {mailSender} = require('../../constraints/sendingMail')

const setContactUs = async (req,res) =>{
 const   {email ,message} = req.body
try {
    if (email ==="") {
        return errorFunc(res,200,"Enter a valid Email")
    }
    const isValidEmail = emailValidator.validate(email)
    if (!isValidEmail) {
        return errorFunc(res,200,"Enter a valid Email")
    }
    const newContactUs = await ContactUs.create({
        email,message,requested_date:new Date
    })
    if (!newContactUs) {
        return errorFunc(res,200,"Contact us not created")
    }
    mailSender(req,res,"yash.bajaj56@gmail.com","Thanks for contacting us")
    return errorFunc(res,200,"Email Sent")
    
} catch (error) {
   return errorFunc(res,400,error.message) 
}
}
module.exports = setContactUs