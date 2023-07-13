const express = require("express");
const { changePassword } = require("../controllers/changePasswordController");
const { login } = require("../controllers/loginController");
const { resetPassword } = require("../controllers/resetPasswordController");
const { userRegister } = require("../controllers/userRegisterController");


const router = express.Router();

router.post("/register", userRegister);
router.post("/login", login);
router.post("/resetpassword", resetPassword);
router.post("/changepassword",changePassword)
module.exports = router;
