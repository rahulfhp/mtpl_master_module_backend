require("dotenv").config();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { errorFunc } = require("../constraints/errorMessage");
const emailValidator = require("email-validator");

const authVerification = async (req, res, next) => {
  try {
    token = req.cookies.jwt ;
    console.log(token);
    const {userid} = req.params;
    if (!token) {
      return errorFunc(res, 400, "No token");
    }
    const verified =  jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    console.log("---Hellooo=-==", verified);
    console.log("--loginId",userid);
    if (verified !== userid) {
      return errorFunc(res, 400, "Sorry you are not verified");
    }
    // const verifiedEmail = emailValidator.validate(loginId)
   
    const user = await User.findOne({
      where: {
        user_id: verified,
        token
      },
    });
    if (!user) {
      return errorFunc(res, 400, "Token is not assigned with this user Id");
    }
    console.log("-----", user.dataValues.token);
    console.log("-----", token);
    console.log("email ----",user);
    if (!user.dataValues.is_verified) {
      return errorFunc(res, 400, "Your id is not verified");
    }
    if (!(user.dataValues.token === token)) {
      return errorFunc(
        res,
        400,
        "You are not verified first go and verify yourself"
      );
    }

    next();
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};

module.exports = { authVerification };
