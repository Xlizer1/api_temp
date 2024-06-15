var db = require('../config/db')
// var dbERP = require('../config/db_erp')
var log4js = require('../config/logger')
var datetime = require('node-datetime')
var auth = require("../jwt/auth");

var errorLogs = log4js.getLogger('errors'),
debugLogs = log4js.getLogger('debugs')

var log_type=[]

module.exports = {
  salt: 10,
  LOW_PRIORITY: 1,
  STATUS_NEW: 1,
  STATUS_NEW_CUSTOMER_CARE: 2,
  PLANNER_DEPARTMENT_ID: 11,
  ADMINISTRATION: 2,
  INTERNAL_TECHNICIANS_ID: 9,
  EXTERNAL_TECHNICIANS_ID: 10,
  USER_DEPARTMENTS_CHECK_AVAILABLITY: [9, 10],
  INSTALLATION_TASK_TYPE: 2, //نصب وتركيب
  CASH_ACCOUNTS_TASK_TYPE: 7, // حسابات
  CUSTOMER_CARE_TASK_TYPE: 9, // خدمة الزبائن
  CUSTOMER_CARE_EXTERNAL_TASK_TYPE: 15, // خدمة الزبائن
  GOVERNORATE_OTHER: 1, // محافظة اخرى
  FINANCES_TASK_TYPE: 17, // حسابات جديدة
  getDateTime: function getDateTime(date, format, noFormat = false) {
    var dt = date ? datetime.create(date) : datetime.create();
    var formatted = noFormat
      ? dt
      : format
      ? dt.format(format)
      : dt.format("Y-m-d H:M:S");
    return formatted;
  },
  addDaysToDateString: function addDaysToDateString(date, days, format) {
    var dt = date ? datetime.create(date) : datetime.create();
    dt.offsetInDays(days);
    var formatted = format ? dt.format(format) : dt.format("Y-m-d H:M:S");
    return formatted;
  },
  addHoursToDateString: function addHoursToDateString(date, hours, format) {
    var dt = date ? datetime.create(date) : datetime.create();
    dt.offsetInHours(hours);
    var formatted = format ? dt.format(format) : dt.format("Y-m-d H:M:S");
    return formatted;
  },
  getDayOfWeekFromDate: function getDayOfWeekFromDate(date, format) {
    var dt = date ? datetime.create(date) : datetime.create();
    var formatted = format ? dt.format(format) : dt.format("Y-m-d H:M:S");
    var ddate = new Date(formatted);
    var dayOfWeek = ddate.getDay();
    return dayOfWeek;
  },

  executeQuery: async function executeQuery(sql, logName, callback) {
    try {
      await db.query(
        {
          sql: sql,
          timeout: 40000,
        },
        (error, result) => {
          if (!error) {
            // console.log("query result "+result.insertId);
            callback(result);
          } else {
            errorLogs.error(`${logName}sql: ${sql}`);
            errorLogs.error(logName + ": " + error);
            callback([false, error?.message]);
          }
        }
      );
    } catch (e) {
      console.log("Error in common.js -> executeQuery: " + e);
    }
  },
  executeERPQuery: async function executeERPQuery(query, logName, callback) {
    // try{
    //     const result =  await dbERP.query(query)
    //     callback(result)
    // }
    // catch(e){
    //     console.log("Error in common.js -> erpExecuteQuery: "+ e)
    //     errorLogs.error(`${logName}sql: ${sql}`)
    //             errorLogs.error(logName+": "+error)
    //             callback([false])
    // }
  },

  checkTokenValidate: function checkTokenValidate(token) {},
  getResponse: function getResponse(_status, _data, _message) {
    var data;
    if (_data) data = _data;
    else data = { message: _message };
    return {
      status: _status,
      data: data,
    };
  },
  getRoleIdFromDepartments: function getRoleIdFromDepartments(id) {
    let code = 0;
    switch (id) {
      case 1:
        code = 38;
        break;
      case 2:
        code = 39;
        break;
      case 3:
        code = 40;
        break;
      case 4:
        code = 41;
        break;
      case 5:
        code = 42;
        break;
      case 6:
        code = 43;
        break;
      case 7:
        code = 44;
        break;
      case 8:
        code = 45;
        break;
      case 9:
        code = 46;
        break;
      case 10:
        code = 47;
        break;
      case 11:
        code = 48;
        break;
      case 12:
        code = 49;
        break;
      default:
        code = 0;
        break;
    }
    return code;
  },
  getTimeDuration: function getTimeDuration(dayDate, fromTime, toTime) {
    const [fromHours, fromMinutes] = fromTime.split(":");
    const [toHours, toMinutes] = toTime.split(":");

    const fromDate = new Date(dayDate);
    const toDate = new Date(dayDate);

    fromDate.setHours(fromHours);
    fromDate.setMinutes(fromMinutes);
    toDate.setHours(toHours);
    toDate.setMinutes(toMinutes);

    const duration = (toDate - fromDate) / 1000; // Duration in seconds

    const hours = Math.floor(duration / 3600); // 3600 seconds in an hour
    const minutes = Math.floor((duration % 3600) / 60); // Remaining seconds divided by 60

    return { hours, minutes };
  },
  arabicToEnglishNumber: function arabicToEnglishNumberWithChars(mixedString) {
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    const englishDigits = "0123456789";

    let result = "";
    for (const char of mixedString) {
      const digitIndex = arabicDigits.indexOf(char);
      if (digitIndex !== -1) {
        result += englishDigits[digitIndex];
      } else {
        result += char; // Keep non-numeric characters unchanged
      }
    }
    return result;
  },
  calculateTimeDifference: function calculateTimeDifference(start, end) {
    const startTime = start.getTime();
    const endTime = end.getTime();

    // Check if start is greater than end
    if (startTime > endTime) {
      // Calculate the time difference in milliseconds
      let timeDiff = startTime - endTime;

      // Convert milliseconds to hours and minutes
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      timeDiff -= hours * (1000 * 60 * 60);

      const minutes = Math.floor(timeDiff / (1000 * 60));

      // Return the result as an object with negative values
      return { hours: -hours, minutes: hours ? minutes : -minutes };
    } else {
      // Calculate the time difference in milliseconds
      let timeDiff = endTime - startTime;

      // Convert milliseconds to hours and minutes
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      timeDiff -= hours * (1000 * 60 * 60);

      const minutes = Math.floor(timeDiff / (1000 * 60));

      // Return the result as an object with positive values
      return { hours, minutes };
    }
  },
  formatCustomTime: function formatCustomTime(inputDate) {
    // Create a new Date object from the input date
    const date = new Date(inputDate);

    // Get hours, minutes, and AM/PM indicator
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours || 12; // Handle midnight (12 AM)

    // Add leading zeros to minutes if needed
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    // Construct the formatted string
    const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;

    return formattedTime;
  },
  getTimestamp: () => {
    const currentTimestamp = new Date();
    const formattedTimestamp = currentTimestamp
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    return formattedTimestamp;
  },
  checkIsAllTechniciansAuthorized: (
    task_id,
    techniciansSelection,
    callback
  ) => {
    let sql = `
            SELECT * FROM 
                customers c
            LEFT JOIN tasks t ON c.customer_id = t.customer_id 
            WHERE t.task_id = ${task_id}
        `;

    if (task_id) {
      module.exports.executeQuery(sql, "getTaskCustomer", async (result) => {
        let customer = result[0];
        if (customer?.erp_customer_supplier_id) {
          let notAuthorizedTechnicians = [];
          if (notAuthorizedTechnicians?.length) {
            if (notAuthorizedTechnicians?.length > 1) {
              callback({
                status: false,
                message:
                  "Technicians " +
                  notAuthorizedTechnicians.map((t) => t.name).join(" ,") +
                  " are not authorized for this task's customer",
                unAuthorizedTechnicians: notAuthorizedTechnicians,
              });
            } else {
              callback({
                status: false,
                message:
                  "Technician " +
                  notAuthorizedTechnicians[0]?.name +
                  " is not authorized for this task's customer",
                unAuthorizedTechnicians: notAuthorizedTechnicians,
              });
            }
          } else {
            callback({
              status: true,
              message:
                "All technicians are authorized for this task's customer",
            });
          }
        } else {
          callback({
            status: false,
            messages: "No customer supplier ID Implemented",
          });
        }
      });
    } else callback({ status: false, messages: "No Task ID Implemented" });
  },
  log_type: log_type,
};