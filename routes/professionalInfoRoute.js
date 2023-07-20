const express = require("express");
const { getAllProfessionalInfo } = require("../controllers/professionalInfoControllers/getAllProfessionalInfoController");
const { getProfessionalInfo } = require("../controllers/professionalInfoControllers/getProffesionalInfoController");
const { professionalRegister } = require("../controllers/professionalInfoControllers/setProfessionalInfoController");


const router = express.Router();

router.post('/setprofessionalinfo',professionalRegister)
router.get('/getprofessionalinfo/all',getAllProfessionalInfo)
router.get('/getprofessionalinfo/:email',getProfessionalInfo)

module.exports = router