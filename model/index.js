
const sequelize = require('../config/database')



const connectToDb = async()=>{
    try {
        await sequelize.sync({force:false})
        console.log('Connected');
    } catch (error) {
        console.log(error);
    }}

    module.exports = {connectToDb}