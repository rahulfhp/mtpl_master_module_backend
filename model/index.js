const sequelize = require("../config/database");
const User = require("./User");
const OtpVerification = require("./OtpVerification");
const ProfessionalDetails = require("./ProfessionalDetails");
const TimeTable = require('./TimeTableModel')
const ContactUs = require('./ContactUsModel')

TimeTable.belongsTo(User, {
  foreignKey: 'user_id', // This will create a foreign key named 'userId' in the Time table
  allowNull: false, // Make the association required (not null)
});

const connectToDb = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectToDb };
