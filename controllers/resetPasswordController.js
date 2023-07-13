const bcrypt = require("bcryptjs");
const {
  emailPasswordError,
  noUser,
  passwordError,
  samePassword,
  updatedPass,
  emailError,
  newPassError,
  confirmPassError,
} = require("../constraints/errorMessage");
const User = require("../model/User");

const resetPassword = async (req, res) => {
  const { email, newpassword, confirmpassword } = req.body;

  try {
    if (!email) {
      return res.send({
        status: 400,
        message: emailError,
      });
    }
    if (!newpassword) {
      return res.send({
        status: 400,
        message: newPassError,
      });
    }
    if (!confirmpassword) {
      return res.send({
        status: 400,
        message: confirmPassError,
      });
    }
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
    }

    //   const pass = await bcrypt.compare(password, user.dataValues.password);
    if (newpassword !== confirmpassword) {
      return res.send({
        status: 400,
        message: samePassword,
      });
    }

    const newpass = await bcrypt.hashSync(newpassword, 13);
    await User.update(
      { password: newpass },
      {
        where: {
          email,
        },
      }
    );

    return res.send({
      status: 200,
      message: updatedPass,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: error.message,
    });
  }
};

module.exports = { resetPassword };
