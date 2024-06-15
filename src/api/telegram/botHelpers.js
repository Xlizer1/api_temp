const executeQuery = require("../../helper/common").executeQuery;
var userModules = require("../users/userModels");
var auth = require("../../jwt/auth");
var fs = require("fs");

async function loginUser(username) {
  return new Promise((resolve) => {
    let device_type = "telegram";
    var sql =
      'select * from users where telegram_username = "' + username + '" ';
    executeQuery(sql, "createToken", (result) => {
      if (result && result[0]?.enabled == 1) {
        userModules.getNewPermissionsAccordingUserBase(result[0], (permissions) => {
          // return roles and specific task ids that can be viewed
          var roles_id = [],
            task_type_id = [];
          if (permissions)
            permissions.forEach((element) => {
              if (element.role_id) roles_id.push(element.role_id);
              else task_type_id.push(element.task_type_id);
            });
          const _token = auth.generate({
            user_id: result[0].user_id,
            username: result[0].username,
            name: result[0].name,
            user_department_id: result[0].department_id,
            roles_id: roles_id,
            task_type_id: task_type_id,
            erp_employee_code: result[0].erp_employee_code,
          });
          sql = `insert into activities set log_type_id=5 ,user_id= ${result[0].user_id},note= '${username} login successfully from ${device_type}' ,created_at=now() `;
          executeQuery(sql, "login_activity", (res) => {
            resolve({
              status: true,
              data: {
                user_id: result[0].user_id,
                username: result[0].username,
                name: result[0].name,
                email: result[0].email,
                roles: roles_id,
                erp_employee_code: result[0].erp_employee_code,
                task_type_id: task_type_id,
                user_department_id: result[0].department_id,
                token: _token,
              },
            });
          });
        });
      } else {
        resolve(false);
      }
    });
  });
}

async function getMissions(obj) {
  return new Promise((resolve) => {
    auth.verify(obj.jwt, async (user_data) => {
      try {
        const user_id = user_data?.user_id;

        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1 and pad with leading zeros.
        const day = String(now.getDate()).padStart(2, "0");

        const formattedDateTime = `${year}-${month}-${day}`;

        var sql =
        "SELECT DISTINCT" +
        " `duration`,`execute_datetime`,`duration`,`instructions`,`note`," +
        " `customers`.`customer_id`,`customers`.`name` AS `customer_name`,`customers`.`phone` AS `customer_phone`," +
        " `mission_geofences`.`name` AS `geofence_name`,`mission_geofences`.`x`,`mission_geofences`.`y`," +
        // +" `missions_statuses`.`mission_status`,`status_name`,`status_color`"
        " IF( `mission_status` IS NULL, 0,`mission_status`) AS `mission_status`," +
        " IF( `status_color` IS NULL,  (SELECT `color`FROM `missions_statuses_dict` WHERE `id`=0 ), `status_color` ) AS `status_color`," +
        " IF( `status_name` IS NULL,  (SELECT `name`FROM `missions_statuses_dict` WHERE `id`=0),`status_name` ) AS `status_name`," +
        " `tasks_missions`.`id` AS `mission_id`" +
        " FROM `tasks_missions`" +
        " LEFT JOIN `tasks` ON `tasks`.`task_id` = `tasks_missions`.`task_id`" +
        " LEFT JOIN `customers` ON `customers`.`customer_id` = `tasks`.`customer_id`" +
        " LEFT JOIN `mission_geofences` ON `mission_geofences`.`mission_id` = `tasks_missions`.`id`" +
        " LEFT JOIN " +
        " (" +
        "          SELECT `status` AS `mission_status`,`missions_statuses_dict`.`name` AS `status_name` ,`missions_statuses_dict`.`color` AS `status_color`,`mission_id` FROM `mission_statuses` " +
        "          INNER JOIN " +
        "          (" +
        "          SELECT MAX(`id`) AS `id`, MAX(`create_date`) AS `create_date`" +
        "      FROM  `mission_statuses` WHERE `mission_statuses`.`user_id`=" +
        user_id +
        " GROUP BY `mission_statuses`.`mission_id`" +
        "      ) AS `mission_statuses_last` on `mission_statuses`.`id` = `mission_statuses_last`.`id` " +
        "      LEFT JOIN `missions_statuses_dict` ON `missions_statuses_dict`.`id`=`mission_statuses`.`status`" +
        "      WHERE `mission_statuses`.`user_id`=" +
        user_id +
        " ) AS `missions_statuses` ON `missions_statuses`.`mission_id` = `tasks_missions`.`id` " +
        "INNER JOIN `missions_technicians` ON `missions_technicians`.`mission_id`=`tasks_missions`.`id`" +
        " WHERE `missions_technicians`.`active`=1 AND `missions_technicians`.`user_id`=" +
        user_id;
      
      sql += ` AND execute_datetime >= "${formattedDateTime} 00:00:00"`;
      
      sql += ` AND execute_datetime <= "${formattedDateTime} 23:59:59"`;

        executeQuery(sql, "getMissionsData", (e) => {
          if (e[0]) resolve(e);
          else resolve(false);
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
}

async function getMissionById(mission_id, obj) {
  return new Promise((resolve) => {
    auth.verify(obj.jwt, async (user_data) => {
      try {
        const user_id = user_data?.user_id;

        var sql =
          "SELECT DISTINCT" +
          " `duration`,`execute_datetime`,`duration`,`instructions`,`note`," +
          " `customers`.`customer_id`,`customers`.`name` AS `customer_name`,`customers`.`phone` AS `customer_phone`," +
          " `mission_geofences`.`name` AS `geofence_name`,`mission_geofences`.`x`,`mission_geofences`.`y`," +
          " IF( `mission_status` IS NULL, 0,`mission_status`) AS `mission_status`," +
          " IF( `status_color` IS NULL,  (SELECT `color`FROM `missions_statuses_dict` WHERE `id`=0 ), `status_color` ) AS `status_color`," +
          " IF( `status_name` IS NULL,  (SELECT `name`FROM `missions_statuses_dict` WHERE `id`=0),`status_name` ) AS `status_name`," +
          " `tasks_missions`.`id` AS `mission_id`" +
          " FROM `tasks_missions`" +
          " LEFT JOIN `tasks` ON `tasks`.`task_id` = `tasks_missions`.`task_id`" +
          " LEFT JOIN `customers` ON `customers`.`customer_id` = `tasks`.`customer_id`" +
          " LEFT JOIN `mission_geofences` ON `mission_geofences`.`mission_id` = `tasks_missions`.`id`" +
          " LEFT JOIN " +
          " (" +
          "          SELECT `status` AS `mission_status`,`missions_statuses_dict`.`name` AS `status_name` ,`missions_statuses_dict`.`color` AS `status_color`,`mission_id` FROM `mission_statuses` " +
          "          INNER JOIN " +
          "          (" +
          "          SELECT MAX(`id`) AS `id`, MAX(`create_date`) AS `create_date`" +
          "      FROM  `mission_statuses` WHERE `mission_statuses`.`user_id`=" +
          user_id +
          " GROUP BY `mission_statuses`.`mission_id`" +
          "      ) AS `mission_statuses_last` on `mission_statuses`.`id` = `mission_statuses_last`.`id` " +
          "      LEFT JOIN `missions_statuses_dict` ON `missions_statuses_dict`.`id`=`mission_statuses`.`status`" +
          "      WHERE `mission_statuses`.`user_id`=" +
          user_id +
          " ) AS `missions_statuses` ON `missions_statuses`.`mission_id` = `tasks_missions`.`id` " +
          "INNER JOIN `missions_technicians` ON `missions_technicians`.`mission_id`=`tasks_missions`.`id`" +
          "WHERE `missions_technicians`.`active`=1 AND `missions_technicians`.`user_id`=" +
          user_id;

      

        sql += " AND tasks_missions.id = " + mission_id;

        let data = await new Promise((resolve) => {
          executeQuery(sql, "getMissionsData", (e) => {
            resolve(e);
          });
        });
        resolve(data[0]);
      } catch (error) {
        console.log(error);
      }
    });
  });
}

async function getSubMission(obj, mission_id) {
  return new Promise((resolve) => {
    auth.verify(obj.jwt, async (user_data) => {
      const user_id = user_data?.user_id;

      var sqlSubMissionStatusData =
        "SELECT FALSE AS `is_new`,TRUE AS `updated_from_api`,`sub_missions`.`id`,`eng_id`,`driver_name`,`phone`, `mission_id`, `user_id`, `sub_missions`.`name`, `created_date` AS `created_at`, `canceled`, `note`, `cancel_reason`, `type_id`, `status_id`, `local_id`,`sub_mission_types`.`name` AS `type_name`, `sub_mission_statuses`.`name` AS `status`, `sub_mission_statuses`.`color` AS `status_color` FROM `sub_missions`" +
        " LEFT JOIN `sub_mission_statuses` ON `sub_mission_statuses`.`id` = `sub_missions`.`status_id`" +
        " LEFT JOIN `sub_mission_types` ON `sub_mission_types`.`id` = `sub_missions`.`type_id`" +
        " WHERE `sub_missions`.`mission_id`=" +
        mission_id +
        " AND `sub_missions`.`user_id`=" +
        user_id;

      var subMissionsData = await new Promise((resolve) => {
        executeQuery(sqlSubMissionStatusData, "submissions telegram", (e) => {
          resolve(e);
        });
      });
      resolve(subMissionsData);
    });
  });
}

async function getSubMissionTypes(obj, mission_id) {
  return new Promise((resolve) => {
    auth.verify(obj.jwt, async (data) => {
      var sqlSubMissionStatusData = "SELECT * FROM sub_mission_types";

      var subMissionsData = await new Promise((resolve) => {
        executeQuery(
          sqlSubMissionStatusData,
          "submissions types telegram",
          (e) => {
            resolve(e);
          }
        );
      });
      resolve(subMissionsData);
    });
  });
}

async function getSubMissionById(sub_mission_id, user) {
  return new Promise((resolve) => {
    auth.verify(user?.token, async (data) => {
      var sqlSubMissionStatusData = `SELECT * FROM sub_missions where id = ${sub_mission_id}`;

      var subMissionsData = await new Promise((resolve) => {
        executeQuery(sqlSubMissionStatusData, "submission", (e) => {
          resolve(e[0]);
        });
      });
      resolve(subMissionsData);
    });
  });
}

async function getImages(sub_mission_id, user) {
  return new Promise((resolve) => {
    auth.verify(user?.token, async (data) => {
      var sql = `SELECT 
      smi.name AS name, 
      sm.name AS sub_mission_name,
      smt.name AS sub_m_type, 
      smit.type AS sub_m_image_type
      FROM sub_mission_images smi
      INNER JOIN sub_missions sm ON smi.sub_mission_id = sm.id
      INNER JOIN sub_mission_types smt ON smi.sub_m_type_id = smt.id
      INNER JOIN sub_m_images_types smit ON smi.sub_m_image_type_id = smit.id    
      where sm.id = "${sub_mission_id}"`;

      executeQuery(sql, "submission", (e) => {
        resolve(e);
      });
    });
  });
}

async function getImage(filename, user) {
  return new Promise((resolve) => {
    auth.verify(user?.token, async (data) => {
      var sql = `SELECT 
      smi.name AS name, 
      sm.name AS sub_mission_name,
      smt.name AS sub_m_type, 
      smit.type AS sub_m_image_type
      FROM sub_mission_images smi
      INNER JOIN sub_missions sm ON smi.sub_mission_id = sm.id
      INNER JOIN sub_mission_types smt ON smi.sub_m_type_id = smt.id
      INNER JOIN sub_m_images_types smit ON smi.sub_m_image_type_id = smit.id    
      where smi.name = "${filename}"`;

      executeQuery(sql, "submission", (e) => {
        resolve(e[0]);
      });
    });
  });
}

async function createNewSubmission(sub_mission, user) {
  return new Promise((resolve) => {
    auth.verify(user?.token, async (data) => {
      var latitude = sub_mission?.latitude ? sub_mission?.latitude : "0.0";
      var longitude = sub_mission?.longitude ? sub_mission?.longitude : "0.0";
      var sql_mission = `INSERT INTO sub_missions (mission_id, name, user_id, created_date, canceled, cancel_reason, note, type_id, status_id, local_id, eng_id, latitude, longitude, driver_name, phone) VALUES 
      (${sub_mission.mission_id}, '${sub_mission.name}', ${
        data.user_id
      }, now(), 0, '', '${sub_mission.note}', ${
        sub_mission?.type_id || null
      }, 1, null, ${sub_mission.eng_id}, '${latitude}', '${longitude}', '${
        sub_mission?.driver_name
      }', '${sub_mission?.phone}')`;

      let insertsub_mission = await new Promise((resolve) => {
        executeQuery(sql_mission, "insertMissionsub_missions", (e) => {
          resolve(e);
        });
      });
      resolve(insertsub_mission);
    });
  });
}

async function uploadImage(image, user) {
  return new Promise((resolve) => {
    auth.verify(user?.token, async (data) => {
      var sql =
        "INSERT INTO `sub_mission_images`(`name`, `sub_mission_id`, `sub_m_type_id`, `sub_m_image_type_id`, `created_at`) " +
        `VALUES ("${image.file_name}", ${image.sub_mission_id}, ${image.sub_m_type}, ${image.image_type}, now());`;
      executeQuery(sql, "insertMissionsub_missions", (e) => {
        resolve(e);
      });
    });
  });
}

async function addTitle(title, id, user) {
  return new Promise((resolve) => {
    auth.verify(user?.token, async (data) => {
      var sql =
        "UPDATE `sub_mission_images` " +
        `SET title = "${title}" WHERE id = ${id}`;
      executeQuery(sql, "insertMissionsub_missions", (e) => {
        resolve(e);
      });
    });
  });
}

async function addNote(note, id, user) {
  return new Promise((resolve) => {
    auth.verify(user?.token, async (data) => {
      var sql =
        "UPDATE `sub_mission_images` " +
        `SET note = "${note}" WHERE id = ${id}`;
      executeQuery(sql, "insertMissionsub_missions", (e) => {
        resolve(e);
      });
    });
  });
}

async function getImageTypesOfSubM(id, obj) {
  return new Promise((resolve) => {
    auth.verify(obj?.jwt, async (data) => {
      var sql = `SELECT sub_image_type_map.image_type_id, sub_m_images_types.type, sub_image_type_map.is_mandatory
      FROM sub_image_type_map 
      JOIN sub_m_images_types ON sub_image_type_map.image_type_id = sub_m_images_types.id
      WHERE sub_image_type_map.sub_m_type_id = ${id} ORDER BY sub_image_type_map.is_mandatory DESC;`;

      executeQuery(sql, "insertMissionsub_missions", (e) => {
        resolve(e);
      });
    });
  });
}

async function getUploadedImageTypes(id, obj) {
  return new Promise((resolve) => {
    auth.verify(obj?.jwt, async (data) => {
      var sql = `SELECT
      smi.name AS name,
      smi.sub_mission_id,
      smt.name AS sub_m_type,
      smit.id AS sub_m_image_type_id,
      smit.type AS sub_m_image_type,
      CASE
        WHEN smi_check.sub_mission_id IS NOT NULL THEN 1
        ELSE 0
      END AS user_added
    FROM sub_mission_images smi
    INNER JOIN sub_mission_types smt ON smi.sub_m_type_id = smt.id
    INNER JOIN sub_m_images_types smit ON smi.sub_m_image_type_id = smit.id
    LEFT JOIN (
      SELECT sub_mission_id, sub_m_type_id
      FROM sub_mission_images
      GROUP BY sub_mission_id, sub_m_type_id
    ) smi_check ON smi.sub_mission_id = smi_check.sub_mission_id AND smi.sub_m_type_id = smi_check.sub_m_type_id
    WHERE smi.sub_mission_id = ${id};
    `;

      executeQuery(sql, "insertMissionsub_missions", (e) => {
        resolve(e);
      });
    });
  });
}

function getMaxFileCountOfSubMission(folderPath, submissionId) {
  const files = fs.readdirSync(folderPath);
  let maxNumber = 0;

  files.forEach((file) => {
    const fileName = file.split(".")[0];
    const [n, n2, userId, submissionIdPart, date, numberPart] =
      fileName.split("_");

    if (submissionIdPart === submissionId.toString()) {
      const number = parseInt(numberPart);

      if (number > maxNumber) {
        maxNumber = number;
        maxFile = file;
      }
    }
  });

  return maxNumber;
}

module.exports = {
  loginUser,
  getMissions,
  getSubMission,
  getSubMissionTypes,
  getSubMissionById,
  createNewSubmission,
  uploadImage,
  addTitle,
  addNote,
  getMaxFileCountOfSubMission,
  getImageTypesOfSubM,
  getMissionById,
  getImages,
  getImage,
  getUploadedImageTypes,
};
