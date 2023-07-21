const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");
const { generateToken } = require("../middleware/generateToken");
require("dotenv").config();
const {
  emailPasswordError,
  noUser,
  passwordError,
  loggedIn,
  errorFunc,
} = require("../constraints/errorMessage");

const login = async (req, res) => {
  let { loginId, password } = req.body;

  try {
    if (loginId ==="" || password==="") {
      return errorFunc(res, 400, emailPasswordError);
    }

    let isEmail = emailValidator.validate(loginId);
    // console.log('email--',isEmail);
    let user = null;
    if (isEmail) {
      user = await User.findOne({
        where: {
          email: loginId,
        },
      });
      if (!user) {
        return errorFunc(res,400,noUser)
      }
      if (user.dataValues.is_verfied) {
        return errorFunc(res,400,"Your Email is not verfied Yet")
      }
    }
    else{
    user = await User.findOne({
      where: {
        phone: loginId,
      },
    });
    if (!user) {
      return errorFunc(res,400,noUser)
    }
    if (user.dataValues.is_verfied) {
      return errorFunc(res,400,"Your Phone Number is not verfied Yet")
    }
  }
    // console.log(user.dataValues.password);
    // console.log("user22----",user);
    if (!user) {
      return errorFunc(res, 400, noUser);
    } else {
      let pass = await bcrypt.compare(password, user.dataValues.password);
      if (!pass) {
        return errorFunc(res, 400, passwordError);
      }

      const token = await generateToken(req, res, user.dataValues.user_id);
      let userUpdate = null;
      if (isEmail) {
        userUpdate = await User.update(
          { token },
          {
            where: {
              email: loginId,
            },
          }
        );
      }
      userUpdate = await User.update(
        { token },
        {
          where: {
            phone: loginId,
          },
        }
      );

      if (!userUpdate) {
        return errorFunc(res, 400, "SomeThing Went Wrong");
      }
      return errorFunc(res, 200, loggedIn);
    }
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};

module.exports = { login };
