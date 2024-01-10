var db = require("../config/db");
var log4js = require("../config/logger");

var errorLogs = log4js.getLogger("errors");

module.exports = {
  executeQuery: async function executeQuery(sql, logName, callback) {
    try {
      await db.query(
        {
          sql: sql,
          timeout: 40000,
        },
        (error, result) => {
          if (!error) {
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
};
