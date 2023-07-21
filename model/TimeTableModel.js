const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const TimeTable = sequelize.define(
  "time_table",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    activity: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    start_time: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    end_time: {
      type: Sequelize.TIME,
      allowNull: false,
    },
   
    created_by: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    last_modified_by: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    sequence: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
  {
    timestrap: true,
  }
);

module.exports = TimeTable;
