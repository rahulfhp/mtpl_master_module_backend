const moment = require("moment");
const bcrypt = require("bcryptjs");
const ProfessionalDetails = require("../../model/ProfessionalDetails");
const emailValidator = require("email-validator");

const {
  emailError,
  passwordError,
  nameError,
  genderError,
  emailExist,
  dobError,
  dobAgeError,
  phoneError,
  errorFunc,
} = require("../../constraints/errorMessage");

const professionalRegister = async (req, res) => {
  try {
    let {
      fullName,
      gender,
      occupation,
      email,
      phone,
     
      professionType,
    } = req.body;

    // Validation for name started
    if (fullName === "") {
      console.log("--Name--");
      return errorFunc(res, 400, nameError);
    }
    // Validation for name ended

    // Validate email started
    if (!email) {
      console.log("--Email--");
      return errorFunc(res, 400, emailError);
    } else {
      let isEmailValid = emailValidator.validate(email);
      if (!isEmailValid) {
        console.log("--email--");
        return errorFunc(res, 400, emailError);
      } else {
        let dbEmail = await ProfessionalDetails.findOne({
          where: {
            email,
          },
        });

        if (dbEmail) {
          return errorFunc(res, 400, emailExist);
        }
      }
    }
    // Validate email ended

    // Validation for gender started

    console.log("--Gender--");
    if (gender === "") {
      return errorFunc(res, 400, genderError);
    } else if (
      !(
        gender.includes("male") ||
        gender.includes("female") ||
        gender.includes("others")
      )
    ) {
      console.log("--Gender--");
      return errorFunc(res, 400, genderError);
    }
    // Validation for gender ended

    //occupation validation started
    if (occupation === "") {
      return errorFunc(res, 400, "Please enter the occupation");
    }
    //occupation validation ended

    // Phone Validation Started
    if (JSON.stringify(phone).length < 10) {
      return errorFunc(res, 400, phoneError);
    }
    // Phone validation ended

    if (professionType ==="") {
        return errorFunc(res, 400, "Enter Valid profession Type");
    }

    //Token Generation

    // const token = await generateToken(req,res,email)

    //     const token = await jwt.sign(email,'yash')

    // res.cookie("jwt",token,{
    //   httpOnly:true
    // })

    const newProfessional = {
      full_name: fullName,
      gender: gender,
      occupation: occupation,
      email: email,
      phone: phone,
      created: new Date(),
      profession_type : professionType
    };

    const user = await ProfessionalDetails.create(newProfessional);

    if (!user) {
      return errorFunc(res, 400, "An Error Occurred");
    }
    return errorFunc(res, 201, "Professional User created");
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};

module.exports = { professionalRegister };
