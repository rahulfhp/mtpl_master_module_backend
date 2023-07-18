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

const getAllProfessionalInfo = async (req, res) => {
    const {skip} = req.query
//   const { email } = req.params;
//   if (!req.params.email) {
//     return errorFunc(res, 400, emailError);
//   }
  try {
    
    const fetchData = await ProfessionalDetails.findAll({
        limit:10,offset:parseInt(skip)
    });
    if (!fetchData) {
        return errorFunc(res, 400, 'No Data Found');
    }
    const data = fetchData.map((row) => row.dataValues);
    // console.log(fetchData);
    
    return errorFunc(res,200,data)
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};

module.exports = { getAllProfessionalInfo };
