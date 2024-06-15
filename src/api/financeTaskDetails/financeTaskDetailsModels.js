var executeQuery = require("../../helper/common").executeQuery;

function checkFinanceType(finance_type_id, existed) {
  var sql = `select id from device_statuses where id = ${finance_type_id} `;
  executeQuery(sql, "checkFinanceType", (result) => {
    if (result.length > 0) existed(true);
    else existed(false);
  });
}

function createFinanceTaskDetails(data, req, callback) {
  var name = req.body.name;
  sql = `insert into device_statuses set name = "${name}"`;
  executeQuery(sql, "insertFinanceType", (result) => {
    callback(result);
  });
}

function deleteFinanceTaskDetails(data, req, callback) {
  var finance_type_id = req.params.finance_type_id;
  checkFinanceType(finance_type_id, (existed) => {
    if (existed) {
      var sql = `delete from device_statuses where id= ${finance_type_id}`;
      executeQuery(sql, "deleteFinanceType", (result) => {
        callback(result);
      });
    } else callback("finance_type_id not existed");
  });
}

function updateFinanceTaskDetails(data, req, callback) {
  var finance_type_id = req.params.finance_type_id,
    name = req.body.name;

  checkFinanceType(finance_type_id, (existed) => {
    if (existed) {
      var sql = `update device_statuses set name = "${name}" where id= ${finance_type_id}`;
      executeQuery(sql, "updateFinanceType", (result) => {
        callback(result);
      });
    } else callback({ status: false, msg: "finance_type_id not existed" });
  });
}

function getFinanceTaskDetails(callback) {
  var sql = `SELECT id, name FROM device_statuses`;
  executeQuery(sql, "getWorkTypes", (result) => {
    callback(result);
  });
}

module.exports = {
  getFinanceTaskDetails,
  createFinanceTaskDetails,
  updateFinanceTaskDetails,
  deleteFinanceTaskDetails,
};
