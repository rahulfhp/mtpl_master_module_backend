const express = require('express')
const app = express()
const { sequelize } = require("./config/database");
const userRegister = require('./routes/userRegisterRoute')
const { connectToDb } = require("./model/index");
const { login } = require('./controllers/loginController');
const { resetPassword } = require('./controllers/resetPasswordController');


const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');
const swaggerJSDoc = require('swagger-jsdoc');
const { changePassword } = require('./controllers/changePasswordController');
// const swaggerSpec = swaggerJSDoc(options)


const PORT = process.env.PORT || 3000;


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))

//All Routes
app.use('/',userRegister)
app.use('/',login)
app.use('/',resetPassword)
app.use('/',changePassword)


app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`)
  await connectToDb();
})