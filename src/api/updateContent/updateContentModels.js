var executeQuery = require("../../helper/common").executeQuery;
var getDateTime = require("../../helper/common").getDateTime;

function checkExists(id, existed) {
  var sql = "select id from `update_contents` where deleted_at is NULL and id = "+id+" ";
  executeQuery(sql, "checkExists", (result) => {
    if (result.length > 0) existed(true);
    else existed(false);
  });
}

function createUpdateContent(data, req, callback) {
  var title = req.body.title,
      version = req.body.version,
      body = req.body.body,
      user_id=data.user_id,
     created_at = getDateTime();
  sql = "insert INTO `update_contents` (version,title,body,created_by,created_at) values ('"+version+"','"+title+"','"+body+"','"+user_id+"','"+created_at+"')";
  executeQuery(sql, "createUpdateContent", (result) => {
    callback(result);
  });
}

function deleteUpdateContent(data, req, callback) {
  var id = req.params.update_content_id,
  user_id=data.user_id
  ;
  checkExists(id, (existed) => {
    if (existed) {
      var sql = "update `update_contents` set deleted_at ='"+getDateTime()+"',deleted_by="+user_id+" where id= "+id;
      executeQuery(sql, "deleteUpdateContent", (result) => {
        callback(result);
      });
    } else callback(false); //'id not existed')
  });
}

function updateUpdateContent(data, req, callback) {
  var id = req.params.update_content_id,
    title = req.body.title,
    version = req.body.version,
    user_id=data.user_id,
    body = req.body.body;
    checkExists(id, (existed) => {
    if (existed) {
      var sql = "update `update_contents` set title ='"+title+"',version='"+version+"',body='"+body+"',updated_by="+user_id+",updated_at='"+getDateTime()+"' where id="+id;
      executeQuery(sql, "updateUpdateContent", (result) => {
        callback(result);
      });
    } else callback({ status: false, msg: "id not existed" });
  });
}

function getUpdateContents(searchFields,callback) {
  var select = `select DISTINCT  update_contents.*,creator.name as creator_name,updater.name as updater_name, userOfDelete.name as user_of_delete_name`;
   select += `,creator_images.path as creator_images_path,updater_images.path as updater_images_path,
   userOfDelete_images.path as user_of_delete_images_path
   `;
  let selectTotal = `SELECT  COUNT(DISTINCT update_contents.id) as total_rows `;
  let sql = " From `update_contents` "
      sql+=' left join users as creator on creator.user_id=update_contents.created_by '
      sql+=' left join users as updater on updater.user_id=update_contents.updated_by '
      sql+=' left join users as userOfDelete on userOfDelete.user_id=update_contents.deleted_by '
      sql+=' left join user_images as creator_images on creator_images.user_id=creator.user_id AND creator_images.is_default = 1 '
      sql+=' left join user_images as updater_images on updater_images.user_id=updater.user_id AND updater_images.is_default = 1 '
      sql+=' left join user_images as userOfDelete_images on userOfDelete_images.user_id=userOfDelete.user_id AND userOfDelete_images.is_default = 1 '
      sql += " where update_contents.deleted_at is NULL ";


  
  if (searchFields.startDate) {
    sql += " AND `update_contents`.`created_at` >= '" + searchFields.startDate + "'";
  }
  if (searchFields.endDate) {
    sql += " AND `update_contents`.`created_at` <= '" + searchFields.endDate + "'";
  }
  if (searchFields.title) {
    sql += " AND `update_contents`.`title` like '%" + searchFields.title + "%'";
  }
  if (searchFields.version) {
    sql += " AND `update_contents`.`version` like '%" + searchFields.version + "%'";
  }
  if (searchFields.body) {
    sql += " AND `update_contents`.`body` like '%" + searchFields.body + "%'";
  }
  console.log('asdasdasdasd===>',select+sql)
  executeQuery(selectTotal + sql, "getGroups", (resultTotal) => {
    let totalRows = -1;
    if (resultTotal && resultTotal.length) {
      totalRows = resultTotal[0].total_rows;
    }
    sql += ` order by update_contents.created_at desc LIMIT ${
      searchFields.offset * searchFields.itemsPerPage
    },${searchFields.itemsPerPage}`;
    executeQuery(select+sql, "getUpdateContents", (result) => {
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
function getUpdateContentList(searchFields,callback) {
  var sql = `select DISTINCT update_contents.*,creator.name as creator_name,updater.name as updater_name, userOfDelete.name as user_of_delete_name`;
  sql += `,creator_images.path as creator_images_path,updater_images.path as updater_images_path,
  userOfDelete_images.path as user_of_delete_images_path
  from update_contents
  `;
  sql+=' left join users as creator on creator.user_id=update_contents.created_by '
  sql+=' left join users as updater on updater.user_id=update_contents.updated_by '
  sql+=' left join users as userOfDelete on userOfDelete.user_id=update_contents.deleted_by '
  sql+=' left join user_images as creator_images on creator_images.user_id=creator.user_id AND creator_images.is_default = 1 '
  sql+=' left join user_images as updater_images on updater_images.user_id=updater.user_id AND updater_images.is_default = 1 '
  sql+=' left join user_images as userOfDelete_images on userOfDelete_images.user_id=userOfDelete.user_id AND userOfDelete_images.is_default = 1 '
  sql += " where update_contents.deleted_at is NULL ";
  if (searchFields.startDate) {
    sql += " AND `update_contents`.`created_at` >= '" + searchFields.startDate + "'";
  }
  if (searchFields.endDate) {
    sql += " AND `update_contents`.`created_at` <= '" + searchFields.endDate + "'";
  }
  if (searchFields.title) {
    sql += " AND `update_contents`.`title` like '%" + searchFields.title + "%'";
  }
  if (searchFields.version) {
    sql += " AND `update_contents`.`version` like '%" + searchFields.version + "%'";
  }
  if (searchFields.body) {
    sql += " AND `update_contents`.`body` like '%" + searchFields.body + "%'";
  }
  executeQuery(sql, "getUpdateContentList", (result) => {
    callback(result);
  });
}
function getUpdateContentListOfVersions(searchFields,callback) {
  var sql = `select distinct version from update_contents where deleted_at is null`;
  executeQuery(sql, "getUpdateContentListOfVersions", (result) => {
    callback(result);
  });
}

module.exports = {
  deleteUpdateContent,
  updateUpdateContent,
  createUpdateContent,
  getUpdateContentList,
  getUpdateContents,
  getUpdateContentListOfVersions
};
