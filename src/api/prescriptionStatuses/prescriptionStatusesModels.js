const executeQuery = require("../../helper/common").executeQuery;

async function getPrescriptionStatuses(params, callBack) {
  var sql = `SELECT * FROM prescription_statuses`;

  executeQuery(sql, "getPrescriptionStatuses", (result) => {
    if (result) callBack(result);
    else callBack(false);
  });
}

module.exports = {
  getPrescriptionStatuses,
};
