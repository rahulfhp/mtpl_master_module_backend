const bcrypt = require("bcryptjs");
const User = require("../model/User");
const uppercaseRegExp = /(?=.*?[A-Z])/;
const lowercaseRegExp = /(?=.*?[a-z])/;
const digitsRegExp = /(?=.*?[0-9])/;
const specialCharRegExp = /(?=.?[#?!@$%^&-])/;
const minLengthRegExp = /.{8,}/;

const {
  samePassword,
  updatedPass,
  oldPassError,
  newPassError,
  confirmPassError,
  errorFunc,
  emailError,
  passwordError,
  minLengthError,
  uppercaseError,
  lowercaseError,
  digitsError,
  specialCharError,
} = require("../constraints/errorMessage");

const changePassword = async (req, res) => {
  const { userid } = req.params;
  const { oldpassword, newpassword, confirmpassword } = req.body;
  try {
    if (oldpassword === "") {
      return errorFunc(res, 400, oldPassError);
    }
    if (newpassword === "") {
      return errorFunc(res, 400, newPassError);
    }
    if (confirmpassword === "") {
      return errorFunc(res, 400, confirmPassError);
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
    if (newpassword !== confirmpassword) {
      return errorFunc(res, 400, "Confirm and New are not same");
    }
    if (oldpassword === newpassword) {
      return errorFunc(res, 400, samePassword);
    }

    const user = await User.findOne({
      where: {
        user_id: userid,
      },
    });
    console.log(user.dataValues.password);
    const comparePass = bcrypt.compareSync(
      oldpassword,
      user.dataValues.password
    );
    console.log(comparePass);
    if (!comparePass) {
      return errorFunc(res, 400, passwordError);
    } else {
      const newpass = bcrypt.hashSync(newpassword, 13);
      await User.update(
        {
          password: newpass,
          token: null,
        },
        {
          where: {
            user_id:userid,
          },
        }
      );
      return errorFunc(res, 200, updatedPass);
    }
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};

module.exports = { changePassword };
