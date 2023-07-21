const { errorFunc } = require("../constraints/errorMessage");
const OtpVerification = require("../model/OtpVerification");
const emailValidator = require("email-validator");
const {userRegister} = require('./userRegisterController')
const {dates } = require('../constraints/comparingDates')


const User = require("../model/User");

// // Function to Compares dates (expiration time and current time in our case)
// var dates = {
//   convert: function (d) {
//     // Converts the date in d to a date-object. The input can be:
//     //   a date object: returned without modification
//     //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
//     //   a number     : Interpreted as number of milliseconds
//     //                  since 1 Jan 1970 (a timestamp)
//     //   a string     : Any format supported by the javascript engine, like
//     //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
//     //  an object     : Interpreted as an object with year, month and date
//     //                  attributes.  **NOTE** month is 0-11.
//     return d.constructor === Date
//       ? d
//       : d.constructor === Array
//       ? new Date(d[0], d[1], d[2])
//       : d.constructor === Number
//       ? new Date(d)
//       : d.constructor === String
//       ? new Date(d)
//       : typeof d === "object"
//       ? new Date(d.year, d.month, d.date)
//       : NaN;
//   },
//   compare: function (a, b) {
//     // Compare two dates (could be of any type supported by the convert
//     // function above) and returns:
//     //  -1 : if a < b
//     //   0 : if a = b
//     //   1 : if a > b
//     // NaN : if a or b is an illegal date
//     return isFinite((a = this.convert(a).valueOf())) &&
//       isFinite((b = this.convert(b).valueOf()))
//       ? (a > b) - (a < b)
//       : NaN;
//   },
//   inRange: function (d, start, end) {
//     // Checks if date in d is between dates in start and end.
//     // Returns a boolean or NaN:
//     //    true  : if d is between start and end (inclusive)
//     //    false : if d is before start or after end
//     //    NaN   : if one or more of the dates is illegal.
//     return isFinite((d = this.convert(d).valueOf())) &&
//       isFinite((start = this.convert(start).valueOf())) &&
//       isFinite((end = this.convert(end).valueOf()))
//       ? start <= d && d <= end
//       : NaN;
//   },
// };

const verificationOTP = async (req, res) => {
   
  
  
  var currentdate = new Date();
  const { otp } = req.body;
  const loginId = req.params.loginId;
  const isValidEmail = emailValidator.validate(loginId);
  const type = req.params.type;
  // console.log(userRegister.newUser);
  try {

    
    const otpSearch = await OtpVerification.findOne({
      where: {
        user_id:loginId,
        otp,
      },
    });
    
    //Check if OTP is available in the DB

    if (otpSearch != null) {
      //Check if OTP is already used or not
      if (otpSearch.is_verified != true) {
        //Check if OTP is expired or not
        if (dates.compare(otpSearch.expire_DateTime, currentdate) == 1) {
          if (type === "newuser" && otp === otpSearch.otp) {
            // Mark OTP as verified or used
            otpSearch.is_verified = true;
            otpSearch.save();
            
            if (isValidEmail) {
              const user = await User.findOne({
                where: {
                  email:loginId,
                },
              });
              user.is_verified = true;
              user.save();
            } else {
              const user = await User.findOne({
                where: {
                  phone: loginId,
                },
              });
              user.is_verified = true;
              user.save();
            }

            const response = { Status: "Success", Details: "You are Verified" };
            return res.status(200).send(response);
          }
          //Check if OTP is equal to the OTP in the DB
          if (type === "existinguser" && otp === otpSearch.otp) {
            // Mark OTP as verified or used
            // otpSearch.is_verified = true;
            // otpSearch.save();

            return res.location(`/newpassword:${loginId}:${otp}`);
          } else {
            const response = { Status: "Failure", Details: "OTP NOT Matched" };
            return res.status(200).send(response);
          }
        } else {
          const response = { Status: "Failure", Details: "OTP Expired" };
          return res.status(200).send(response);
        }
      } else {
        const response = { Status: "Failure", Details: "OTP Already Used" };
        return res.status(200).send(response);
      }
    } else {
      const response = { Status: "Failure", Details: "Wrong OTP or no OTP" };
      return res.status(200).send(response);
    }
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};

module.exports = { verificationOTP };
