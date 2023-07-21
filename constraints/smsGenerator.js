const { errorFunc } = require("./errorMessage");

const accountSid = "AC8bbf5e2035bb07b63158b6e38c0a1f29";
const authToken = "838760be0102bbc6e47a9fb4642d4819";
const client = require("twilio")(accountSid, authToken);

const smsGeneration = async ( res,countryCode , number, otp) => {
  try {
    phoneNumber = countryCode + number
    const message = await client.messages.create({
      body: `OTP is ${otp}`,
      to: phoneNumber,
      from: "+12517148236",
    });
    console.log(message);
    if (!message) {
      return errorFunc(res, 400, "Error in sending message");
    }
    return errorFunc(res, 200, "Message Sent");
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};

module.exports = { smsGeneration };
