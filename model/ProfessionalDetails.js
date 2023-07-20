const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const ProfessionalDetails = sequelize.define(
  "professional_details",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    occupation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },

  
    created: {
      type: Sequelize.DATE,
    },
    created_by: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    last_modified: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    last_modified_by: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    profession_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestrap: true,
  }
);

module.exports = ProfessionalDetails;
