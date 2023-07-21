const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const userRegister = require("./routes/userRegisterRoute");
const deleteUserRoute = require("./routes/userDeleteRoute");
const professionalInfoRoute = require("./routes/professionalInfoRoute");
const timeTableRoute = require("./routes/timeTableRoute");
const contactUsRoute = require("./routes/contactUsRoute");


const { connectToDb } = require("./model/index");

const cron = require("node-cron");

const User = require("./model/User");
const OtpVerification = require("./model/OtpVerification");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const currentDate = new Date();



const PORT = process.env.PORT || 3000;

app.use(cookieParser());

cron.schedule("*/5 * * * *", async function () {
  console.log("---------------------");
  console.log("running a task every 5 Minutes");
  const user = await User.findAll({ where: { is_verified: null } });
  const otp = await OtpVerification.findAll();

  // Filter the instances based on the condition (is_created greater than createdAt)
  const filteredInstances = user.filter(
    (elem) => elem.created.getTime() < currentDate.getTime()
  );
  const filteredInstancesForOTP = otp.filter(
    (elem) => elem.createdAt.getTime() < currentDate.getTime()
  );

  // Destroy the filtered instances
  for (const instance of filteredInstances) {
    await instance.destroy();
    console.log("Instance with ID:", instance.user_id, "has been destroyed.");
  }
  for (const instance of filteredInstancesForOTP) {
    await instance.destroy();
    console.log(
      "Instance with ID: ",
      instance.id,
      " of OTP has been destroyed."
    );
  }
});

// const jwt = require("jsonwebtoken");
// const { updateProfile } = require("./controllers/updateProfileController");

// const createToken = async () => {
//   const token = await jwt.sign(
//     {
//       email: "yash.bajaj56@gmail.com",
//     },
//     process.env.ACCESS_TOKEN_SECRET
//   );

//   console.log(token);
//   const verify = await jwt.verify(token,"yash")
//   console.log(verify);
// };
// createToken()

//All Routes

//middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", userRegister);
// app.use('/',updateProfile)
app.use("/", deleteUserRoute);
app.use("/", professionalInfoRoute);
app.use("/", timeTableRoute);
app.use("/", contactUsRoute);

app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`);
  await connectToDb();
});
