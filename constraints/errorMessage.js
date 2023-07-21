
const errorFunc = (res, status, message) => {
  return res.status(status).json({
    status,
    message,
  });
};

const emailError = "Email is invalid";
const passwordError = "Please enter valid password";
const nameError = "Please enter valid Name";
const genderError = "Please enter valid Gender";
const emailExist = "Email already exists";
const dobError = "Enter valid Date of Birth";
const dobAgeError = "Age Should be greater than 12";
const phoneError = "Enter valid Phone Number";
const emailPasswordError = "Please enter email and password";
const noUser = "User doesn't exist";
const loggedIn = "Logged In";
const samePassword = "Both password are same";
const updatedPass = "Password has been updated";
const oldPassError = "Please Enter Old password";
const newPassError = " Please Enter New password";
const confirmPassError = " Please Enter confirm password";
const minLengthError = "Password should  be of length 8";
const uppercaseError = "There should be 1 uppercase letter";
const lowercaseError = "There should be 1 lowercase letter";
const digitsError = "There should be digits too";
const specialCharError = "There should be 1 special character";

module.exports = {
  specialCharError,
  digitsError,
  lowercaseError,
  emailError,
  passwordError,
  nameError,
  genderError,
  emailExist,
  dobError,
  dobAgeError,
  phoneError,
  emailPasswordError,
  uppercaseError,
  noUser,
  loggedIn,
  samePassword,
  updatedPass,
  oldPassError,
  newPassError,
  confirmPassError,
  errorFunc,
  minLengthError,
};
