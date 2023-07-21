const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const OtpVerification = sequelize.define(
  "otpverification",
  {
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    
    },
    otp: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expire_DateTime: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    is_verified:{
      type: Sequelize.BOOLEAN,
      allowNull: true,
    }
  },
  {
    timestrap: true,
  }
);


module.exports = OtpVerification;
