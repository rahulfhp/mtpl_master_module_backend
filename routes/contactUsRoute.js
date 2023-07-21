const express = require("express");
const setContactUs = require("../controllers/contactUsController/setContactUs") 


const router = express.Router();


router.post('/contactus',setContactUs)


module.exports = router;
