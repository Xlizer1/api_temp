var executeQuery = require("../../helper/common").executeQuery;
var getDateTime = require("../../helper/common").getDateTime;

function checkGroupExists(id, existed) {
  var sql = "select id from `groups` where deleted_at is NULL and id = "+id+" ";
  executeQuery(sql, "checkGroupExists", (result) => {
    if (result.length > 0) existed(true);
    else existed(false);
  });
}

function createGroup(data, req, callback) {
  var name = req.body.name,
    created_at = getDateTime();
  sql = "insert INTO `groups` (name,created_at) values ('"+name+"','"+created_at+"')";
  executeQuery(sql, "createGroup", (result) => {
    callback(result);
  });
}

function deleteGroup(data, req, callback) {
  var id = req.params.group_id;
  checkGroupExists(id, (existed) => {
    if (existed) {
      var sql = "update `groups` set deleted_at ='"+getDateTime()+"' where id= "+id;
      executeQuery(sql, "deleteGroup", (result) => {
        callback(result);
      });
    } else callback(false); //'id not existed')
  });
}

function updateGroup(data, req, callback) {
  var id = req.params.group_id,
    name = req.body.name;
  checkGroupExists(id, (existed) => {
    if (existed) {
      var sql = "update `groups` set name ='"+name+"',updated_at='"+getDateTime()+"' where id="+id;
      executeQuery(sql, "updateGroup", (result) => {
        callback(result);
      });
    } else callback({ status: false, msg: "id not existed" });
  });
}

function getGroups(searchFields,callback) {
  var select = `select *  `;
  let selectTotal = `SELECT count(*) as total_rows`;
  let sql = " From `groups` where deleted_at is NULL ";
  
  if (searchFields.startDate) {
    sql += " AND `groups`.`created_at` >= '" + searchFields.startDate + "'";
  }
  if (searchFields.endDate) {
    sql += " AND `groups`.`created_at` <= '" + searchFields.endDate + "'";
  }
  if (searchFields.name) {
    sql += " AND `groups`.`name` like '%" + searchFields.name + "%'";
  }

  executeQuery(selectTotal + sql, "getGroups", (resultTotal) => {
    // console.log("getGroups", resultTotal);
    let totalRows = -1;
    if (resultTotal && resultTotal.length) {
      totalRows = resultTotal[0].total_rows;
    }
    sql += ` order by groups.created_at desc LIMIT ${
      searchFields.offset * searchFields.itemsPerPage
    },${searchFields.itemsPerPage}`;
    executeQuery(select+sql, "getGroups", (result) => {
        let response = {
            total: totalRows,
            data: result,
            page: searchFields.offset,
          };
          callback(response);
          return;
    });
  });
}
function getGroupList(searchFields,callback) {
  var sql = "select * from `groups` where deleted_at is NULL ";
  if (searchFields.startDate) {
    sql += " AND `groups`.`created_at` >= '" + searchFields.startDate + "'";
  }
  if (searchFields.endDate) {
    sql += " AND `groups`.`created_at` <= '" + searchFields.endDate + "'";
  }
  if (searchFields.name) {
    sql += " AND `groups`.`name` like '%" + searchFields.name + "%'";
  }
  // console.log('asdasdasdsad=====>',sql)
  executeQuery(sql, "getGroups", (result) => {
    callback(result);
  });
}

module.exports = {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroups,
  getGroupList
};
