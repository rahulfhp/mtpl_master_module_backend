
const User = require("../model/User");
const {
  errorFunc,
  emailError,
  noUser,
} = require("../constraints/errorMessage");
const emailValidator = require("email-validator");


const deleteUser = async (req, res) => {
  const { loginId } = req.body;
  try {
    if (!loginId) {
      return errorFunc(res, 400, "PLease Enter Login Id");
    }
    let isEmailValid = emailValidator.validate(loginId);
    if (!isEmailValid) {
      const user = await User.findOne({
        where: {
          phone:loginId,
        },
      });
      if (!user) {
        return errorFunc(res, 400, noUser);
      }
      if (user.dataValues.is_deleted) {
        return errorFunc(res, 400, "User doesn't exist");
      }
      let deleteUser = await User.update(
        { is_deleted: true },
        {
          where: {
            phone:loginId,
          },
        }
      );
      if (!deleteUser) {
        return errorFunc(res, 400, "An Error Occured");
      }
  
      return errorFunc(res, 200, "Succesfully deleted the User");
    }

    const user = await User.findOne({
      where: {
        loginId:email,
      },
    });
    if (!user) {
      return errorFunc(res, 400, noUser);
    }
    if (user.dataValues.is_deleted) {
      return errorFunc(res, 400, "User doesn't exist");
    }
    let deleteUser = await User.update(
      { is_deleted: true },
      {
        where: {
          loginId:email,
        },
      }
    );
    if (!deleteUser) {
      return errorFunc(res, 400, "An Error Occured");
    }

    return errorFunc(res, 200, "Succesfully deleted the User");
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};
module.exports = { deleteUser };
