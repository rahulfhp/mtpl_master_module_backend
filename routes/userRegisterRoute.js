const express = require("express");
const { changePassword } = require("../controllers/changePasswordController");
const { login } = require("../controllers/loginController");
const { newPassword } = require("../controllers/newPassword");
const { verificationOTP } = require("../controllers/otpVerification");
const { emailVerification } = require("../controllers/emailVerificationController");
const { updateProfile } = require("../controllers/updateProfileController");
const { userRegister } = require("../controllers/userRegisterController");
const {authVerification} = require('../middleware/tokenAuthorization');
const { getProfileInfo } = require("../controllers/getProfileInfo");



const router = express.Router();

router.post("/register", userRegister);
router.post("/login",login);
router.post("/emailverification", emailVerification);
router.post("/changepassword/:userid",authVerification,changePassword)
router.post("/updateprofile/:userid",authVerification,updateProfile)
router.post('/otpverification/:loginId/:type',verificationOTP)
router.post('/newpassword/:loginId/:otp',newPassword)
router.get('/getprofileinfo/:userid',authVerification,getProfileInfo)
module.exports = router;
