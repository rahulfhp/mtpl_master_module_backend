const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const ContactUs = sequelize.define(
  "contact_us",
  {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

   
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    message: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    requested_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
   
  },
  {
    timestrap: true,
  }
);

module.exports = ContactUs;
