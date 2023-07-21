const User = require("../../model/User");
const TimeTable = require("../../model/TimeTableModel");
const { errorFunc } = require("../../constraints/errorMessage");

const getTimeTable = async (req, res) => {
  const { userid } = req.params;
  try {
    const user = await User.findOne({
      where: {
        user_id: userid,
      },
    });
    if (!user) {
      return errorFunc(res, 200, "User doesn't exist");
    }
    const timeTable = await TimeTable.findAll({where:{
        userId:userid
    }});
    if (!timeTable) {
      return errorFunc(res, 200, "No timetable");
    }

   
    const data = timeTable.map((row)=>{
        return {"Sequence":row.dataValues.sequence,"Activity":row.dataValues.activity,"Starting Time":row.dataValues.start_time,"Ending Time":row.dataValues.end_time}
    })
    return errorFunc(res, 200, data);
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};
module.exports = getTimeTable;
