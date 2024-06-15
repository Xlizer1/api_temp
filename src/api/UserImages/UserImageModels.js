var executeQuery = require("../../helper/common").executeQuery;
const { getDateTime } = require("../users/userModels");
const path = require("path");
const fs = require("fs");
var msg = require("../../helper/messages");

function getUserImages(searchFields, callback) {
  try {
    let select = `SELECT *`;
    let selectTotal = `SELECT count(*) as total_rows`;

    var sql = ` from user_images where user_images.user_id=${searchFields.user_id}`;

    //console.log("selectTotal+sql", selectTotal + sql);

    executeQuery(selectTotal + sql, "getUserImages", (resultTotal) => {
      //console.log("getUserImages", resultTotal);
      totalRows = -1;
      if (resultTotal && resultTotal.length) {
        totalRows = resultTotal[0].total_rows;
      }
      sql += ` order by user_images.id desc LIMIT ${
        searchFields.offset * searchFields.itemsPerPage
      },${searchFields.itemsPerPage}`;
      executeQuery(select + sql, "getUserImages", (result) => {
        //console.log("getUserImages", result);
        if (result) {
          let response = {
            total: totalRows,
            data: result,
            page: searchFields.offset,
          };
          callback(response);
          return;
        } else {
          callback(false);
          return;
        }
      });
    });
  } catch (err) {
    callback(false);
    return;
  }
}
function getUserImagesList(searchFields, callback) {
  try {
    let select = `SELECT * from user_images where user_images.user_id=${searchFields.user_id} order By user_images.id and user_images.is_default desc`;

    executeQuery(select, "getUserImages", (result) => {
      if (result) return callback(result);
      else return callback(false);
    });
  } catch (err) {
    callback(false);
    return;
  }
}
function createUserImage(searchFields, callback) {
  var file = searchFields.file;
  var user_id = searchFields.user_id;
  var ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1);

  var fileName = `${user_id}__${getDateTime(null, "ymd_HMN")}.${ext}`;

  const userImageDate = new Date();
  const year = userImageDate.getFullYear();
  const month = String(userImageDate.getMonth() + 1).padStart(2, "0");

  const folderPath = path.join(
    __dirname,
    `/../../../dist/uploads/users/images/${month}_${year}`
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const tempPath = file.path;
  const targetPath = path.join(folderPath, fileName);
  const filePath = `${month}_${year}/${fileName}`;

  fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      //console.log(err);
      callback({ status: false, data: err });
      return;
    }

    var sql = `
    BEGIN;
    INSERT INTO user_images (
        name,
        path,
        user_id,
        is_default
    )
    VALUES (
        "${fileName}",
        "uploads/users/images/${filePath}",
        ${user_id},
        1
    );
    COMMIT;`;

    executeQuery(sql, "createUserImage", (result) => {
      if (result && result[1] && result[1].insertId) {
        let sql2 = `BEGIN;
        UPDATE user_images 
        SET is_default = 0 
        WHERE user_images.user_id = ${user_id} 
          AND user_images.id != ${result[1].insertId} 
          AND user_images.is_default = 1;
        COMMIT;`;
        executeQuery(
          sql2,
          "handle remove the default value from the other images record",
          (updateResult) => {
            if (updateResult) {
              callback({
                status: true,
                data: {
                  message: msg.inserted,
                },
              });
            } else callback({ status: false, data: msg.error });
          }
        );
      } else callback({ status: false, data: msg.error });
    });
  });
}
function updateUserImage(searchFields, callback) {
  var user_id = searchFields.user_id;
  var user_image_id = searchFields.user_image_id;
  var sql = `
  BEGIN;
UPDATE user_images 
SET is_default = 1
WHERE user_images.id = ${user_image_id} AND user_images.user_id = ${user_id} 
  AND user_images.is_default = 0;
COMMIT;
    `;

  executeQuery(sql, "updateUserImage", (result) => {
    //console.log("asasdasdasdasd======>", result);
    if (result) {
      let sql2 = `BEGIN;
      UPDATE user_images 
      SET is_default = 0 
      WHERE user_images.user_id = ${user_id} 
        AND user_images.id != ${user_image_id} 
        AND user_images.is_default = 1;
      COMMIT;`;
      executeQuery(
        sql2,
        "handle remove the default value from the other images record",
        (updateResult) => {
          if (updateResult) {
            callback({
              status: true,
              data: {
                message: msg.updated,
              },
            });
          } else callback({ status: false, data: msg.error });
        }
      );
      return;
    } else {
      callback(false);
      return;
    }
  });
}
function deletedUserImage(searchFields, callback) {
  let user_image_id = searchFields.user_image_id;
  var sql = `DELETE FROM user_images
  WHERE user_images.id = ${user_image_id};
  `;

  executeQuery(sql, "deletedUserImage", (result) => {
    if (result) {
      callback(result);
      return;
    } else {
      callback(false);
      return;
    }
  });
}

module.exports = {
  createUserImage,
  updateUserImage,
  deletedUserImage,
  getUserImages,
  getUserImagesList
};
