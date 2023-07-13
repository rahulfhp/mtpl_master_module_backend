const moment = require("moment");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
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
} = require("../constraints/errorMessage");

const userRegister = async (req, res) => {
  try {
    let {
      fullName,
      email,
      password,
      gender,
      dob,
      provider,
      profilePicture,
      isAdmin,
      isVerified,
      phone,
    } = req.body;

    // Validation for name started
    if (fullName === "") {
      console.log("--Name--");
      return res.send({
        status: 400,
        message: nameError,
      });
    }
    // Validation for name ended

    // Validate email started
    if (!email) {
      console.log("--Email--");
      return res.send({
        status: 400,
        message: emailError,
      });
    } else {
      let isEmailValid = emailValidator.validate(email);
      if (!isEmailValid) {
        console.log("--email--");
        return res.send({
          status: 400,
          message: emailError,
        });
      } else {
        let dbEmail = await User.findOne({
          where: {
            email,
          },
        });

        if (dbEmail) {
          return res.send({
            status: 400,
            message: emailExist,
          });
        }
      }
    }
    // Validate email ended

    // Validation for gender started

    console.log("--Gender--");
    if (gender === "") {
      return res.send({
        status: 400,
        message: genderError,
      });
    } else if (
      !(
        gender.includes("male") ||
        gender.includes("female") ||
        gender.includes("others")
      )
    ) {
      console.log("--Gender--");
      return res.send({
        status: 400,
        message: genderError,
      });
    }
    // Validation for gender ended

    // Validation for provider started

    console.log("--provider--");
    if (provider === "") {
      provider = null;
    }
    // Validation for provider ended

    // Validate password started

    console.log("hello  ----" + password);
    if (password === "") {
      return res.send({
        status: 400,
        message: passwordError,
      });
    }

    const pass = await bcrypt.hashSync(password, 13);

    let isHashedPassword = await pass;
    // Validate password ended

    //Validate DOB started
    console.log("===== ", moment(dob, ["YYYY-MM-DD"]).isValid());
    if (dob === "") {
      return res.send({
        status: 400,
        message: dobError,
      });
    }
    let newdob = moment(dob).format("YYYY-MM-DD");
    if (!moment(newdob).isValid()) {
      return res.send({
        status: 400,
        message: dobError,
      });
    }
    if (moment().diff(newdob, "years") < 13) {
      return res.send({
        status: 400,
        message: dobAgeError,
      });
    }

    //Validate DOB ended

    // Phone Validation Started
    if (JSON.stringify(phone).length < 10) {
      return res.send({
        status: 400,
        message: phoneError,
      });
    }
    // Phone validation ended

    const newUser = {
      full_name: fullName,
      email: email,
      password: isHashedPassword,
      phone: phone,
      profile_image: profilePicture,
      gender: gender,
      dob: newdob,
      is_verified: isVerified,
      is_admin: isAdmin,
      created: new Date(),
      provider: provider,
    };

    const user = await User.create(newUser);

    if (user) {
      return res.send({
        status: 201,
        message: "Data Sent",
      });
    } else {
      return res.send({
        status: 400,
        message: "An Error occurred",
      });
    }
  } catch (error) {
    return res.send({
      status: 400,
      message: error.message,
    });
  }
};

module.exports = { userRegister };
