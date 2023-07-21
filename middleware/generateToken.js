require('dotenv').config()
const jwt = require('jsonwebtoken')
const{ errorFunc} = require('../constraints/errorMessage')


const generateToken = async (req, res, loginId) => {
    // const email = req.body.email
    try {
        const token = await jwt.sign(loginId, process.env.ACCESS_TOKEN_SECRET);

        res.cookie("jwt", token, {
          httpOnly: true,
        });
        // console.log(token);
        return token
    } catch (error) {
        return errorFunc(res, 400, error.message);

    }
  
  
};

module.exports = {generateToken}