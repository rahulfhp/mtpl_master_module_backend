const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "user",
  {
    user_id: {
      type: Sequelize.STRING(36),
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },

    full_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      defaultValue: null
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      defaultValue: null,
    },
    profile_image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    gender: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    dob: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,

      defaultValue: false,
    },
    is_admin: {
      type: Sequelize.BOOLEAN,

      defaultValue: false,
    },
    created: {
      type: Sequelize.DATE,
    },
    provider: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    token: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestrap: true,
  }
);

module.exports = User;
