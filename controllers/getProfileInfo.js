const { errorFunc, noUser } = require('../constraints/errorMessage')
const User = require('../model/User')


const getProfileInfo = async (req,res)=>{
    try {
        const {userid} = req.params

    if (!userid) {
        return errorFunc(res,400,"Please enter valid userid")
    }
    const user = await User.findOne({
        where:{
            user_id:userid
        }
    })
    if (!user) {
        return errorFunc(res,400,noUser)
    }
    return res.status(200).json({
        "User ID":user.dataValues.user_name,
       "Name": user.dataValues.full_name,
       "Email": user.dataValues.email?user.dataValues.email:'NA',
       "Country Code": user.dataValues.country_code,
       "Phone": user.dataValues.phone?user.dataValues.phone:'NA',
       "Profile Image": user.dataValues.profile_image?user.dataValues.profile_image:'NA',
       "Gender": user.dataValues.gender,
        "Date of Birth": user.dataValues.dob,
       

       
    })
    } catch (error) {
        return errorFunc(res,400,error.message)
    }

    

}



module.exports = {getProfileInfo}