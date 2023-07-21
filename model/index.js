const sequelize = require("../config/database");
const User = require("./User");
const OtpVerification = require("./OtpVerification");
const ProfessionalDetails = require("./ProfessionalDetails");

const connectToDb = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectToDb };
