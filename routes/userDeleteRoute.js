const express = require("express");
const { deleteUser } = require("../controllers/deleteUserController");
const {authVerification} = require('../middleware/tokenAuthorization')

const router = express.Router();


router.delete('/deleteuser',authVerification,deleteUser)
module.exports = router;
