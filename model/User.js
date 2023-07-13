const Sequelize = require('sequelize')
const sequelize = require('../config/database')


const User = sequelize.define('user', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    full_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull: false,
       
    },
    password:{
        type:Sequelize.STRING,
        allowNull: false,
        
    },
    phone:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    profile_image:{
        type:Sequelize.STRING,
        allowNull: true,
    },
    gender:{
        type:Sequelize.STRING(10),
        allowNull: false,
    },
    dob:{
        type:Sequelize.DATEONLY,
        allowNull: true,
    },
    is_verified:{
        type:Sequelize.BOOLEAN,
    },
    is_admin:{
        type:Sequelize.BOOLEAN,
    },
    created:{
        type:Sequelize.DATE,
    },
    provider:{
        type:Sequelize.STRING,
        allowNull: true,
    },
    is_deleted:{
        type:Sequelize.BOOLEAN,
        allowNull: true,
    }

},{
    timestrap:true
});

module.exports = User;