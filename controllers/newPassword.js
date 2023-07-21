const User = require("../model/User");
const bcrypt = require("bcryptjs");
const OtpVerification = require("../model/OtpVerification");
const uppercaseRegExp = /(?=.*?[A-Z])/;
const lowercaseRegExp = /(?=.*?[a-z])/;
const digitsRegExp = /(?=.*?[0-9])/;
const specialCharRegExp = /(?=.?[#?!@$%^&-])/;
const minLengthRegExp = /.{8,}/;
const emailValidator = require("email-validator");
const {
  noUser,
  newPassError,
  confirmPassError,
  errorFunc,
  minLengthError,
  uppercaseError,
  lowercaseError,
  digitsError,
  specialCharError,
} = require("../constraints/errorMessage");
const newPassword = async (req, res) => {
  let { newpassword, confirmpassword } = req.body;
  let { loginId, otp } = req.params;
  const isVerifiedEmail = emailValidator.validate(loginId);

  try {
    if (!newpassword) {
      return errorFunc(res, 400, newPassError);
    }
    if (!confirmpassword) {
      return errorFunc(res, 400, confirmPassError);
    }
    if (newpassword !== confirmpassword) {
      return errorFunc(res, 400, "Both Password Should be same");
    }
    if (newpassword) {
      const minLengthPassword = minLengthRegExp.test(newpassword);
      if (!minLengthPassword) {
        return errorFunc(res, 400, minLengthError);
      }
      const uppercasePassword = uppercaseRegExp.test(newpassword);
      if (!uppercasePassword) {
        return errorFunc(res, 400, uppercaseError);
      }
      const lowercasePassword = lowercaseRegExp.test(newpassword);
      if (!lowercasePassword) {
        return errorFunc(res, 400, lowercaseError);
      }
      const digitsPassword = digitsRegExp.test(newpassword);
      if (!digitsPassword) {
        return errorFunc(res, 400, digitsError);
      }
      const specialCharPassword = specialCharRegExp.test(newpassword);
      if (!specialCharPassword) {
        return errorFunc(res, 400, specialCharError);
      }
    }
    const otpSearch = await OtpVerification.findOne({
      where: { otp, user_id: loginId },
    });
    // console.log("-----", otpSearch);
    if (!otpSearch) {
      return errorFunc(res, 400, noUser);
    }
    // if (otpSearch.dataValues.is_verified != true) {
    //   return errorFunc(res, 400, "OTP already used");
    // }

    if (isVerifiedEmail) {
      const user = await User.findOne({
        where: {
          email: otpSearch.dataValues.user_id,
        },
      });
      // console.log(user.dataValues.password);
      if (!user) {
        return errorFunc(res, 400, noUser);
      }
    } else {
      const user = await User.findOne({
        where: {
          phone: otpSearch.dataValues.user_id,
        },
      });
      // console.log(user.dataValues.password);
      if (!user) {
        return errorFunc(res, 400, noUser);
      }
    }

    if (otpSearch.is_verified == true) {
      return errorFunc(res, 400, "Already Used");
    }

    const hashedPass = bcrypt.hashSync(newpassword, 13);
    if (isVerifiedEmail) {
      const updatedPass = await User.update(
        {
          password: hashedPass,
        },
        {
          where: {
            email: otpSearch.dataValues.user_id,
          },
        }
      );
      if (!updatedPass) {
        return errorFunc(res, 400, "Something went wrong");
      }
    } else {
      const updatedPass = await User.update(
        {
          password: hashedPass,
        },
        {
          where: {
            phone: otpSearch.dataValues.user_id,
          },
        }
      );
      if (!updatedPass) {
        return errorFunc(res, 400, "Something went wrong");
      }
    }
    otpSearch.is_verified = true;
    otpSearch.save();
    return errorFunc(res, 200, "Password successfully changed");
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};
module.exports = { newPassword };
