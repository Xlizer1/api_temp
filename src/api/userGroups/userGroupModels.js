var executeQuery = require("../../helper/common").executeQuery;
var getDateTime = require("../../helper/common").getDateTime;

function checkGroupRolesExistAndDeleteIfExists(data, existed) {
  var deleteQuery = `DELETE FROM user_groups WHERE  user_id=${data?.assigned_user_id}`;
  executeQuery(deleteQuery, "deleteQuery", (result) => {
    existed(true);
  });
}

function createUserGroups(data, callback) {
  var assigned_user_id = data.assigend_user_id,
    group_ids = data?.group_ids;
  checkGroupRolesExistAndDeleteIfExists({
    assigned_user_id,
    group_ids
  }, (result) => {
    if (group_ids && group_ids?.length) {
      const insertQuery = `INSERT INTO user_groups (user_id, group_id) VALUES `;
      var values = ''
      group_ids && group_ids?.map((groupID, index) => {
        if ((index + 1) == group_ids?.length)
          values += `(${assigned_user_id}, ${groupID})`
        else
          values += `(${assigned_user_id}, ${groupID}),`

      });
      executeQuery(insertQuery + values, "createUserGroups", (result) => {
        // console.log(`${result.affectedRows} row(s) inserted.`);
        callback(result);
      });
    }else return callback(true)

  });
}

function getUserGroups(data, callback) {
  var assigned_user_id = data.assigned_user_id;
  let sql = `select group_id from user_groups where user_id =${assigned_user_id}`;
  executeQuery(sql, "getUserGroups", (result) => {
    callback(result);
    return;
  });
}
function getUserGroupsById(data, callback) {
  var assigned_user_id = data.assigned_user_id;
  let sql = "select `groups`.* from user_groups left join `groups` on `groups`.id = user_groups.group_id where user_id ="+assigned_user_id;
  executeQuery(sql, "getUserGroups", (result) => {
    callback(result);
    return;
  });
}

module.exports = {
  createUserGroups,
  getUserGroups,
  getUserGroupsById
};
