const express = require("express");
const setTimeTable = require('../controllers/timeTableControllers/setTimeTable')
const getTimeTable = require('../controllers/timeTableControllers/getTimeTable')
const {authVerification} = require('../middleware/tokenAuthorization')


const router = express.Router();


router.post('/timetable/:userid',authVerification,setTimeTable)
router.get('/timetable/:userid',authVerification,getTimeTable)

module.exports = router;
