const moment = require("moment");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const emailValidator = require("email-validator");
const { errorFunc, noUser,emailError } = require("../constraints/errorMessage");
var otpGenerator = require("otp-generator");
const OtpVerification = require("../model/OtpVerification");
const { mailSender } = require("../constraints/sendingMail");
const {AddMinutesToDate} = require('../constraints/addMinutes')
const PhoneNumberValidation = require("libphonenumber-js");
// const now = new Date()



const updateProfile = async (req, res) => {
  let {userid} =req.params 

  let {
   
    fullName,
    newEmail,
    countryCode,
    phone,
  } = req.body;

  try {
    if (!userid) {
      return errorFunc(res, 400, noUser);
    }

    const user = await User.findOne({
      where: {
        user_id:userid,
      },
    });
    if (!user) {
      return errorFunc(res, 400, "User Doesn't Exist");
    }
    
    if (newEmail) {
      let newValidatedEmail = emailValidator.validate(newEmail);
      if (!newValidatedEmail) {
        return errorFunc(res, 400, emailError);
      }
    }
    if (phone) {
      if (countryCode ="") {
        return errorFunc(res, 400, "Country Code is not there");
      }
      
      const phoneNumberWithCountryCode = countryCode + phone;
      const phoneNumber = PhoneNumberValidation.parse(
        phoneNumberWithCountryCode
      );
      const isValid = PhoneNumberValidation.isValidNumber(phoneNumber);
      if (!isValid) {
        return errorFunc(res, 400, phoneError);
      }
    }
    if (user.dataValues.email != null ) {
      const existingUser = await User.findOne({
        where: {
          email: newEmail,
        },
      });
      if (existingUser) {
        return errorFunc(res, 400, "Cant use this email as it exist");
      }
    }
    if (user.dataValues.phone != null ) {
      const existingUser = await User.findOne({
        where: {
          phone,
        },
      });
      if (existingUser) {
        return errorFunc(res, 400, "Cant use this phone number as it exist");
      }
    }
    
   
    let updatedUser = await User.update(
      {
        full_name: fullName ? fullName : user.dataValues.full_name,
        email: newEmail ? newEmail : user.dataValues.email,
        phone: phone ? phone : user.dataValues.phone,
        is_verified:0
      },
      {
        where: {
          user_id:userid,
        },
      }
    );
    if (!updatedUser) {
      return errorFunc(res, 400, "There is some error");
    }
    //Generate OTP
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const now = new Date();

    const expiration_time = AddMinutesToDate(now, 3);
    if (newEmail && phone) {
      // console.log("newEmail-----",newEmail);
      const data = {
        user_id:newEmail,
        otp: otp,
        expire_DateTime: expiration_time,
      };
      const otpSent = await OtpVerification.create(data);
      if (!otpSent) {
        return errorFunc(res, 400, "OTP not saved in DB");
      }
      //-----Change the Email------
      mailSender(req, res, "yash.bajaj56@gmail.com", otp);
      smsGeneration(res,countryCode, phone, otp);

     return res.location(`/otpverification/${newEmail}/newuser`);
      // User.create(newUser);
    } else if (newEmail || !phone) {
      // console.log("---email",newEmail);
      const data = {
        user_id:newEmail,
        otp: otp,
        expire_DateTime: expiration_time,
      };
      const otpSent = await OtpVerification.create(data);
      if (!otpSent) {
        return errorFunc(res, 400, "OTP not saved in DB");
      }
      //-----Change the Email------
      mailSender(req, res, "yash.bajaj56@gmail.com", otp);
      // User.create(newUser)
      return res.location(`/otpverification/${newEmail}/newuser`);
    } else if (phone || !newEmail) {
      const data = {
        user_id: phone,
        otp: otp,
        expire_DateTime: expiration_time,
      };
      const otpSent = await OtpVerification.create(data);
      if (!otpSent) {
        return errorFunc(res, 400, "OTP not saved in DB");
      }
      //-----Change the Phone Number------
      // mailSender(req, res, "yash.bajaj56@gmail.com", otp);
      let sentSms = smsGeneration(res,countryCode, phone, otp);
      if (!sentSms) {
        return errorFunc(res, 400, "SMS not sent");
      }

     return res.location(`/otpverification/${phone}/newuser`);
      // await User.create(newUser);
    }

    //  await User.create(newUser);
    else {
      return errorFunc(res, 400, "An Error Occurred");
    }
    

  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};

module.exports = { updateProfile };
