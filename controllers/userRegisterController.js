const moment = require("moment");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const emailValidator = require("email-validator");
const uppercaseRegExp = /(?=.*?[A-Z])/;
const lowercaseRegExp = /(?=.*?[a-z])/;
const digitsRegExp = /(?=.*?[0-9])/;
const specialCharRegExp = /(?=.?[#?!@$%^&-])/;
const minLengthRegExp = /.{8,}/;
var otpGenerator = require("otp-generator");
const OtpVerification = require("../model/OtpVerification");
const { mailSender } = require("../constraints/sendingMail");
const PhoneNumberValidation = require("libphonenumber-js");
let { AddMinutesToDate } = require("../constraints/addMinutes");

const {
  emailError,
  passwordError,
  nameError,
  genderError,
  dobError,
  dobAgeError,
  phoneError,
  errorFunc,
  minLengthError,
  uppercaseError,
  lowercaseError,
  digitsError,
  specialCharError,
} = require("../constraints/errorMessage");
const { smsGeneration } = require("../constraints/smsGenerator");

const userRegister = async (req, res) => {
  try {
    const nowForCreation = new Date();
    // let newUser = null;
    let {
      fullName,
      email,
      password,
      gender,
      dob,
      provider,
      profilePicture,
      countryCode,
      phone,
    } = req.body;

    // Validation for name started
    if (fullName === "") {
      // console.log("--Name--");
      return errorFunc(res, 400, nameError);
    }
    // Validation for name ended

    //If both email and phone are not there
    if (email === "" && phone === "") {
      return errorFunc(
        res,
        400,
        "Please enter either of one phone or email or both"
      );
    }

    // Validation for gender started

    // console.log("--Gender--");
    if (gender === "") {
      return errorFunc(res, 400, genderError);
    } else if (
      !(
        gender.includes("male") ||
        gender.includes("female") ||
        gender.includes("others")
      )
    ) {
      // console.log("--Gender--");
      return errorFunc(res, 400, genderError);
    }
    // Validation for gender ended

    // Validation for provider started

    // console.log("--provider--");
    if (provider === "") {
      provider = null;
    }
    // Validation for provider ended

    // Validate password started

    // console.log("hello  ----" + password);
    if (password === "") {
      return errorFunc(res, 400, passwordError);
    } else if (password) {
      const minLengthPassword = minLengthRegExp.test(password);
      if (!minLengthPassword) {
        return errorFunc(res, 400, minLengthError);
      }
      const uppercasePassword = uppercaseRegExp.test(password);
      if (!uppercasePassword) {
        return errorFunc(res, 400, uppercaseError);
      }
      const lowercasePassword = lowercaseRegExp.test(password);
      if (!lowercasePassword) {
        return errorFunc(res, 400, lowercaseError);
      }
      const digitsPassword = digitsRegExp.test(password);
      if (!digitsPassword) {
        return errorFunc(res, 400, digitsError);
      }
      const specialCharPassword = specialCharRegExp.test(password);
      if (!specialCharPassword) {
        return errorFunc(res, 400, specialCharError);
      }
    }

    const isHashedPassword = bcrypt.hashSync(password, 13);

    // Validate password ended

    //Validate DOB started
    // console.log(typeof(dob));
    // console.log("===== ", moment(dob, ["YYYY-MM-DD"]));
    if (dob === "") {
      return errorFunc(res, 400, dobError);
    }
    let newdob = moment(dob).format("YYYY-MM-DD");
    // console.log(newdob.format("yyyy-mm--dd"));
    // console.log("NewDate---",newdob);
    if (!moment(newdob).isValid()) {
      return errorFunc(res, 400, dobError);
    }
    if (moment().diff(newdob, "years") < 13) {
      // console.log(moment().diff(newdob, "years") < 13);
      return errorFunc(res, 400, dobAgeError);
    }

    //Validate DOB ended
    //Country code validation
    if (countryCode === "") {
      return errorFunc(res, 400, "Please enter a country code");
    }

    // Phone Validation Started

    if (phone === "") {
      phone = null;
    }
    if (phone) {
      const phoneNumberWithCountryCode = countryCode + phone;
      const phoneNumber = PhoneNumberValidation.parse(
        phoneNumberWithCountryCode
      );
      const isValid = PhoneNumberValidation.isValidNumber(phoneNumber);
      if (!isValid) {
        return errorFunc(res, 400, phoneError);
      } else {
        let dbPhone = await User.findOne({
          where: {
            phone,
          },
        });
        if (dbPhone) {
          if (dbPhone.is_verified) {
            return errorFunc(res, 400, "Existing User");
          }

          await dbPhone.update(
            {
              full_name: fullName,
              email: email,
              password: isHashedPassword,
              country_code: countryCode,
              phone: phone,
              profile_image: profilePicture,
              gender: gender,
              dob: newdob,

              created: AddMinutesToDate(nowForCreation, 5),
              provider: provider,
            },
            {
              where: {
                phone,
              },
            }
          );
          //Generate OTP
          const otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
          });
          const now = new Date();

          const expiration_time = AddMinutesToDate(now, 3);

          const data = {
            user_id: phone,
            otp: otp,
            expire_DateTime: expiration_time,
          };
          const otpSent = await OtpVerification.create(data);
          if (!otpSent) {
            return errorFunc(res, 400, "OTP not saved in DB");
          }
          //-----Change the Email------
          // mailSender(req, res, "yash.bajaj56@gmail.com", otp);
          smsGeneration(res, countryCode, phone, otp);

          return res.location(`/otpverification/${phone}/newuser`);
        }
      }
    }

    // Phone validation ended
    // Validate email started
    if (email === "") {
      email = null;
    }
    // console.log("this is blank---", email);
    if (email) {
      let isEmailValid = emailValidator.validate(email);
      if (!isEmailValid) {
        return errorFunc(res, 400, emailError);
      } else {
        let dbEmail = await User.findOne({
          where: {
            email,
          },
        });

        if (dbEmail) {
          if (dbEmail.is_verified) {
            return errorFunc(res, 400, "User already exist");
          }
          //Generate OTP
          await dbEmail.update(
            {
              full_name: fullName,
              email: email,
              password: isHashedPassword,
              country_code: countryCode,
              phone: phone,
              profile_image: profilePicture,
              gender: gender,
              dob: newdob,

              created: AddMinutesToDate(nowForCreation, 5),
              provider: provider,
            },
            {
              where: {
                email,
              },
            }
          );
          const otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
          });
          const now = new Date();

          const expiration_time = AddMinutesToDate(now, 3);

          const data = {
            user_id: email,
            otp: otp,
            expire_DateTime: expiration_time,
          };
          const otpSent = await OtpVerification.create(data);
          if (!otpSent) {
            return errorFunc(res, 400, "OTP not saved in DB");
          }
          //-----Change the Email------
          mailSender(req, res, "yash.bajaj56@gmail.com", otp);
          // smsGeneration(res, phone, otp);

          return res.location(`/otpverification/${email}/newuser`);
        }
      }
    }

    let newUser = {
      full_name: fullName,
      email: email,
      password: isHashedPassword,
      country_code: countryCode,
      phone: phone,
      profile_image: profilePicture,
      gender: gender,
      dob: newdob,

      created: AddMinutesToDate(nowForCreation, 5),
      provider: provider,
    };

    const user = await User.create(newUser);
    if (!user) {
      return errorFunc(res, 400, "Cannot Create User");
    }

    //Generate OTP
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const now = new Date();

    const expiration_time = AddMinutesToDate(now, 3);
    if (email && phone) {
      const data = {
        user_id: email,
        otp: otp,
        expire_DateTime: expiration_time,
      };
      const otpSent = await OtpVerification.create(data);
      if (!otpSent) {
        return errorFunc(res, 400, "OTP not saved in DB");
      }
      //-----Change the Email------
      mailSender(req, res, "yash.bajaj56@gmail.com", otp);
      smsGeneration(res, countryCode, phone, otp);

      res.location(`/otpverification/${email}/newuser`);
      // User.create(newUser);
    } else if (email || !phone) {
      const data = {
        user_id: email,
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
      res.location(`/otpverification/${email}/newuser`);
    } else if (phone || !email) {
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

      let sentSms = smsGeneration(res, countryCode, phone, otp);
      if (!sentSms) {
        return errorFunc(res, 400, "SMS not sent");
      }

      res.location(`/otpverification/${phone}/newuser`);
    } else {
      return errorFunc(res, 400, "An Error Occurred");
    }
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};

module.exports = { userRegister };
