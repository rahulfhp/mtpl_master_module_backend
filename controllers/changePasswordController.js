const bcrypt = require("bcryptjs");
const User = require("../model/User");
const {
  samePassword,
  updatedPass,
  oldPassError,
  newPassError,
  confirmPassError,
  passwordError,
} = require("../constraints/errorMessage");

const changePassword = async (req, res) => {
  const { email, oldpassword, newpassword, confirmpassword } = req.body;
  try {
    if (!email) {
      return res.send({
        status: 400,
        message: emailError,
      });
    }
    if (!oldpassword) {
      return res.send({
        status: 400,
        message: oldPassError,
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

    if (newpassword !== confirmpassword) {
      return res.send({
        status: 400,
        message: "New and COnfirm doesnt match",
      });
    }
    if (oldpassword === newpassword) {
      return res.send({
        status: 400,
        message: samePassword,
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });
    console.log(user.dataValues.password);
    const comparePass = await bcrypt.compareSync(
        oldpassword,
      user.dataValues.password,
      
    );
    console.log(comparePass);
    if (!comparePass) {
      return res.send({
        status: 400,
        message: 'hello',
      });
    }
    else{
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
    });}
  } catch (error) {
    return res.send({
      status: 400,
      message: error.message,
    });
  }
};

module.exports = { changePassword };
