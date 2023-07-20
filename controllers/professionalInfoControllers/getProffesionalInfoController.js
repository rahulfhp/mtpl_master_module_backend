const ProfessionalDetails = require("../../model/ProfessionalDetails");
const {
  emailError,
  passwordError,
  nameError,
  genderError,
  emailExist,
  dobError,
  dobAgeError,
  phoneError,
  errorFunc,
} = require("../../constraints/errorMessage");

const getProfessionalInfo = async (req, res) => {
  const { email } = req.params;
  if (!req.params.email) {
    return errorFunc(res, 400, emailError);
  }
  try {
    const fetchData = await ProfessionalDetails.findOne({ where: { email } });
    if (!fetchData) {
        return errorFunc(res, 400, 'No Such email exist');
    }
    return errorFunc(res,200,fetchData.dataValues)
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};

module.exports = { getProfessionalInfo };
