const User = require("../model/User");
const bcrypt = require("bcryptjs");
const {
  emailPasswordError,
  noUser,
  passwordError,
  loggedIn,
} = require("../constraints/errorMessage");

const login = async (req, res) => {
  let { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.send({
        status: 400,
        message: emailPasswordError,
      });
    } else {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      // console.log(user.dataValues.password);
      if (!user) {
        return res.send({
          status: 400,
          message: noUser,
        });
      } else {
        const pass = await bcrypt.compare(password, user.dataValues.password);
        if (!pass) {
          return res.send({
            status: 400,
            message: passwordError,
          });
        }
        return res.send({
          status: 200,
          message: loggedIn,
        });
      }
    }
  } catch (error) {
    return res.send({
      status: 400,
      message: error.message,
    });
  }
};

module.exports = { login };
