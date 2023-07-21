const User = require("../../model/User");
const TimeTable = require("../../model/TimeTableModel");
const { errorFunc } = require("../../constraints/errorMessage");
const moment = require('moment')
function isValidTime(timeString) {
    // Use strict parsing to ensure that the input is a valid time format
    const time = moment(timeString, 'HH:mm', true);
  
    // Check if the parsed moment object is valid
    return time.isValid();
  }

const setTimeTable = async (req, res) => {
  const { userid } = req.params;
  const jsonData = req.body;
  if (!Array.isArray(jsonData)) {
    return res.status(400).json({ error: "JSON data must be an array." });
  }
  try {
    
    
    const user = await User.findOne({
      where: {
        user_id: userid,
      },
    });
    if (!user) {
      return errorFunc(res, 200, "User doesn't exist");
    }
    // const data = {
    //   sequence,
    //   activity,
    //   start_time: startTime,
    //   end_time: endTime,
    //   userId:user.user_id
    // };
    for (const record of jsonData) {
      if (!record.activity || !record.startTime || !record.endTime || !record.sequence) {
        return res.status(400).json({ error: "Incomplete record. Please provide activity, start_time, end_time, and sequence for each record." });
      }

      if (typeof record.activity !== "string") {
        return res.status(400).json({ error: "Activity must be a string." });
      }

      if (!moment(record.startTime, "HH:mm", true).isValid() || !moment(record.endTime, "HH:mm", true).isValid()) {
        return res.status(400).json({ error: "Invalid time format. Expected format: HH:mm" });
      }

      if (isNaN(parseInt(record.sequence))) {
        return res.status(400).json({ error: "Sequence must be an integer." });
      }
      const newTimeTable =  await TimeTable.create({
        activity: record.activity,
        start_time: record.startTime,
        end_time: record.endTime,
        sequence: record.sequence,
        user_id:userid
      });
      if (!newTimeTable) {
        return errorFunc(res, 200, "Cannot create Time Table ");
    }
    return errorFunc(res, 201, "Time Table Created");
    }

  
    
   
  } catch (error) {
    return errorFunc(res, 400, error.message);
  }
};

module.exports = setTimeTable;
