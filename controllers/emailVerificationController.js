const bcrypt = require("bcryptjs");
const emailValidator = require("email-validator");
const OtpVerification = require("../model/OtpVerification");
var otpGenerator = require("otp-generator");
const { smsGeneration } = require("../constraints/smsGenerator");
const {AddMinutesToDate}  =require('../constraints/addMinutes')

let {
  noUser,

  emailError,

  errorFunc,
} = require("../constraints/errorMessage");

const User = require("../model/User");
const { mailSender } = require("../constraints/sendingMail");




const emailVerification = async (req, res, next) => {
  const{ loginId } = req.body;
  try {
    if (loginId === "") {
      return errorFunc(res, 400, "Please enter Login Id");
    }

  let validEmail = emailValidator.validate(loginId)
  // console.log(loginId);
  if (!validEmail) {
    
    const user = await User.findOne({
      where: {
        phone:loginId,
    
      },
    });
    // console.log(user.dataValues.password);
    if (!user) {
      return errorFunc(res, 400, noUser);
    }
  }
else{
  const user = await User.findOne({
    where: {
      email:loginId,
    },
  });
  // console.log(user.dataValues.password);
  if (!user) {
    return errorFunc(res, 400, noUser);
  }
}
  
    
    
    
    //Generate OTP
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const now = new Date();

    const expiration_time = AddMinutesToDate(now, 3);
    const data = {
     user_id: loginId,
      otp: otp,
      expire_DateTime: expiration_time,
    };
    const otpSent = await OtpVerification.create(data);
    if (!otpSent) {
      return errorFunc(res, 400, "OTP not saved in DB");
    }
    //-----Change the Email------
    if (validEmail) {
      
      mailSender(req, res, "yash.bajaj56@gmail.com", otp);
    }
    else{
      let user = await User.findOne({
        where: {
          phone:loginId,
        },
      });
      smsGeneration(res,user.dataValues.country_code,loginId,otp);
    }

    return res.location(`/otpverification:${loginId}/existinguser`);
    // console.log("Went to ");

    //     // if (!sentMail) {
    //     //   return errorFunc(res, 400, "There is some error please try again");
    //     // }

    // console.log("Going to otpverifivation");
    // res.location('/otpverification')
    // console.log("Back from otpverifivation");
    //     //   const pass = await bcrypt.compare(password, user.dataValues.password);

    //     const newpass =   bcrypt.hashSync(newpassword, 13);
    //      await User.update(
    //       { password: newpass },
    //       {
    //         where: {
    //           email,
    //         },
    //       }
    //     );

    //       console.log("Work Done");
    //      console.log("-----------------");
    //  return errorFunc(res, 200, updatedPass);

    //  return  errorFunc(res, 200, updatedPass);
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};

module.exports = { emailVerification };
