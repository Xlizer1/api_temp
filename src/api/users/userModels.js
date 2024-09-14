var activity = require("../../helper/activitiesMsg");
var executeQuery = require("../../helper/common").executeQuery;
var getDateTime = require("../../helper/common").getDateTime;
const bcrypt = require("bcrypt");
const createExcelReport = require("../../helper/createExcelReport");
const messages = require("../../helper/messages");
const { getSuppliers } = require("../../helper/services");
const saltRounds = 10;
var forEach = require("async-foreach").forEach;
var getRoles = require("../../helper/services").getRoles;
var getRes = require("../../helper/common").getResponse;

function insertUser(creator_id, userDetails, callback) {
  try {
    //throw TypeError;

    bcrypt
      .hash(userDetails.password, saltRounds)
      .then(function (hashedPassword) {
        let wialonHost = userDetails?.wialon_host
          ? userDetails?.wialon_host
          : "";
        var sql = `BEGIN;
                insert into users (username, password, name, email,department_id,phone,patients_per_day,birthdate,created_at,account_name,default_route,allow_send_email,is_group_base_role) 
                values ("${userDetails?.username}", "${hashedPassword}", "${
          userDetails?.name
        }","${userDetails?.email}" ,
                ,${userDetails?.depId},"${userDetails?.phone}","${
          userDetails?.patients_per_day
        }","${userDetails?.birthdate}", "${getDateTime()}","${
          userDetails?.account_name ? userDetails?.account_name : ""
        }","${userDetails?.default_route ? userDetails?.default_route : ""}",${
          userDetails?.allow_send_emails ? userDetails?.allow_send_emails : 0
        },${userDetails?.is_group_base_role ? 1 : 0});
                INSERT INTO activities (user_id,user_id_affected,log_type_id,note,created_at) 
                        VALUES(${creator_id},LAST_INSERT_ID(),${1},'${JSON.stringify(
          userDetails
        )}','${getDateTime()}');
                COMMIT;`;
        executeQuery(sql, "insertUser", (result) => {
          callback(result);
        });
      });
  } catch (error) {
    callback(false);
    ////console.log(error)
  }
}

function updateUserDetails(data, req, callback) {
  var name = req.body.name ? '"' + req.body.name + '"' : "name",
    email = req.body.email ? '"' + req.body.email + '"' : "email",
    dep_id = req.body.department_id
      ? '"' + req.body.department_id + '"'
      : "department_id",
    phone = req.body.phone ? '"' + req.body.phone + '"' : "phone",
    patients_per_day = req.body.patients_per_day
      ? '"' + req.body.patients_per_day + '"'
      : "patients_per_day",
    birthdate = req.body.birthdate
      ? '"' + req.body.birthdate + '"'
      : "birthdate",
    telegram_username = req.body.telegram_username
      ? '"' + req.body.telegram_username + '"'
      : "telegram_username",
    default_route = req.body.default_route
      ? '"' + req.body.default_route + '"'
      : "default_route",
    allow_send_emails = req?.body?.allow_send_emails
      ? req?.body?.allow_send_emails
      : 0,
    is_group_base_role = req?.body?.is_group_base_role
      ? req?.body?.is_group_base_role
      : 0;

  var sql = `BEGIN;
        update users set name= ${name},email=${email}, department_id=${dep_id},phone=${phone},patients_per_day=${patients_per_day}
        ,birthdate=${birthdate}, default_route=${default_route}, updated_at="${getDateTime()}" , allow_send_email=${allow_send_emails},is_group_base_role=${is_group_base_role} where user_id=${
    req.params.user_id
  };
        INSERT INTO activities (user_id,user_id_affected,log_type_id,note,created_at) 
            VALUES(${data.user_id}, ${
    req.params.user_id
  }, ${2},'${JSON.stringify(req.body)}', '${getDateTime()}');
        COMMIT;`;
  executeQuery(sql, "updateUserDetails", (result) => {
    callback(result[1]);
  });
}

function enableUser(tokenData, req, callback) {
  var userHimself = req.params.user_id == tokenData.user_id;
  enabled = userHimself ? "enabled" : req.body.enabled;

  // getLogType(logType=>{
  var sql = `BEGIN;
        update users set enabled= ${enabled}, updated_at="${getDateTime()}" where user_id=${
    req.params.user_id
  };
        INSERT INTO activities (user_id,user_id_affected,log_type_id,note,created_at) 
            VALUES(${tokenData.user_id}, ${req.params.user_id}, ${3},'Status: ${
    enabled == 0 ? "disabled" : enabled == 1 ? "enabled" : "not changed"
  }' ,'${getDateTime()}'); 
        COMMIT;`;
  executeQuery(sql, "enableUser", (result) => {
    callback(result[1]);
  });
  // })
}

function checkUsernameOrIdExisting(username, user_id, existed) {
  var sql;
  if (username)
    sql = `select username from users where username = "${username}" `;
  else sql = `select user_id from users where user_id = ${user_id} `;
  executeQuery(sql, "checkUsernameOrIdExisting", (result) => {
    if (result.length > 0) existed(true);
    else existed(false);
  });
}

function checkDepartmentId(dep_id, existed) {
  var sql = `select department_id from departments where deleted_at is NULL and department_id = "${dep_id}" `;
  executeQuery(sql, "checkDepartmentId", (result) => {
    if (result.length > 0) existed(true);
    else existed(false);
  });
}

async function getPermissions(user_id, callback) {
  var sql = `select a.role_id,b.name from permissions a left join roles b on a.role_id=b.role_id where a.user_id = "${user_id}" `;
  executeQuery(sql, "getPermissions", (result) => {
    if (result.length > 0) callback(result);
    else callback([]);
  });
}

function getNewPermissions(user_id, callback) {
  var sql = `SELECT if((select b.task_type_id from roles b where b.role_id = a.role_id)is null,a.role_id,null) as role_id,
    if((select c.task_type_id from roles c where c.role_id = a.role_id)is null,null,(select d.task_type_id from roles d where d.role_id=a.role_id)) as task_type_id
     from permissions a where a.user_id= ${user_id} `;
  executeQuery(sql, "getNewPermissions", (result) => {
    if (result.length > 0) callback(result);
    else callback([]);
  });
}

function getNewPermissionsAccordingUserBase(data, callback) {
  if (data?.is_group_base_role == 0) {
    var sql = `SELECT if((select b.task_type_id from roles b where b.role_id = a.role_id)is null,a.role_id,null) as role_id,
        if((select c.task_type_id from roles c where c.role_id = a.role_id)is null,null,(select d.task_type_id from roles d where d.role_id=a.role_id)) as task_type_id
        from permissions a where a.user_id= ${data?.user_id} `;
    executeQuery(sql, "getNewPermissions", (result) => {
      if (result.length > 0) callback(result);
      else callback([]);
    });
  } else {
    var sql =
      "SELECT if((select b.task_type_id from roles b where b.role_id = group_roles.role_id)is null,group_roles.role_id,null) as role_id, ";
    sql +=
      " if((select c.task_type_id from roles c where c.role_id = group_roles.role_id)is null,null,(select d.task_type_id from roles d where d.role_id=group_roles.role_id)) as task_type_id ";
    sql += " from user_groups ";
    sql +=
      " left join group_roles on user_groups.group_id=group_roles.group_id ";
    sql += " left join `groups` on user_groups.group_id=`groups`.id ";
    sql += " where `groups`.deleted_at is null ";
    sql += " AND user_groups.user_id= " + data?.user_id;
    executeQuery(sql, "getNewPermissions", (result) => {
      if (result.length > 0) callback(result);
      else callback([]);
    });
  }
}

function setPermissions(data, req, callback) {
  try {
    var roles_id =
      req && req.body && req.body.roles_id ? req.body.roles_id : [];
  } catch (err) {
    var roles_id = [];
  }
  try {
    var user_id =
      req && req.params && req.params.user_id ? req.params.user_id : 0;
  } catch (err) {
    var user_id = 0;
  }
  if (!user_id) {
    return callback(false);
  }

  function removeOldPermissions(user_id, callback) {
    executeQuery(
      `delete from permissions where user_id=${user_id}`,
      "removeOldPermissions",
      (result) => {
        callback(result);
      }
    );
  }

  removeOldPermissions(user_id, (result) => {
    if (!roles_id || roles_id.length <= 0) return callback(true);
    getRoles((roles) => {
      // //console.log(roles)
      var i = 0,
        activityRoles = "";
      for (const new_role_id of roles_id) {
        activityRoles += roles[new_role_id] + ", ";
        var sql = `insert into permissions set user_id=${user_id} , role_id=${new_role_id}`;
        executeQuery(sql, "setPermissions", (result) => {
          i++;
          if (i >= roles_id.length) {
            var _sql = `INSERT INTO activities (user_id,user_id_affected,log_type_id,note,created_at) 
                                   VALUES(${
                                     data.user_id
                                   }, ${user_id}, 4 ,'${activityRoles}' ,'${getDateTime()}') `;

            executeQuery(_sql, "setPermissions_activity", (result) => {
              if (result) return callback(true);
              else return callback(false);
            });
            // callback(true)
          }
        });
        // //console.log(activityRoles)
      }
    });
  });
}

function checkOldPassword(user_id, old_password, callback) {
  var sql = `select password from users where user_id = "${user_id}"`;
  executeQuery(sql, "checkOldPassword", (result) => {
    bcrypt.compare(old_password, result[0].password).then(function (result) {
      if (result) callback(result);
      else callback(false);
    });
  });
}

function updateUserPassword(data, user_id, new_password, callback) {
  bcrypt.hash(new_password, saltRounds).then(function (hashedPassword) {
    var sql = `BEGIN;
        update users set password="${hashedPassword}" where user_id = "${user_id}";
        INSERT INTO activities (user_id,user_id_affected,log_type_id,note,created_at) 
        VALUES(${data.user_id}, ${user_id}, 2 ,'password changed by ${
      data.user_id
    }' ,'${getDateTime()}'); 
        COMMIT;`;
    executeQuery(sql, "updateUserPassword", (result) => {
      if (result[1].affectedRows > 0) callback(true);
      else callback(false);
    });
  });
}

function getUsers(haveRole, user_id, departments, searchFields, callback) {
  //    var sql = `select a.*,(select created_at from activities where log_type_id = 5 and user_id=a.user_id order by created_at desc limit 1) as last_login from users a  where a.deleted_at is null `
  var select = `SELECT a.*,a.last_login_date AS last_login  `;
  let selectTotal = `SELECT count(*) as total_rows `;
  let sql = ` from users a 
    where a.deleted_at is null`;
  // //console.log('getUsers===>',searchFields)
  if (user_id) sql = sql + ` and a.user_id = ${user_id}`;
  if (!haveRole) sql += ` and a.enabled= 1`;

  if (searchFields.startDate) {
    sql += " AND `a`.`created_at` >= '" + searchFields.startDate + "'";
  }
  if (searchFields.endDate) {
    sql += " AND `a`.`created_at` <= '" + searchFields.endDate + "'";
  }

  if (searchFields.name) {
    sql += ` AND a.name LIKE '%${searchFields.name}%'`;
  }
  if (searchFields.username) {
    sql += ` AND a.username LIKE '%${searchFields.username}%'`;
  }
  if (searchFields.email) {
    sql += ` AND a.email LIKE '%${searchFields.email}%'`;
  }
  if (searchFields.phone) {
    sql += ` AND a.phone LIKE '%${searchFields.phone}%'`;
  }
  if (searchFields.accountname) {
    sql += ` AND a.account_name LIKE '%${searchFields.accountname}%'`;
  }
  if (searchFields.department_id) {
    sql += ` AND a.department_id = ${searchFields.department_id}`;
  } else {
    sql += ` AND a.department_id != 3`;
  }
  if (searchFields.active_status || searchFields.active_status === 0) {
    sql += ` AND a.enabled = ${searchFields.active_status}`;
  }
  // else{
  //     sql+=` AND a.department_id != 12`
  // }

  executeQuery(selectTotal + sql, "getUsers", (resultTotal) => {
    let totalRows = -1;
    if (resultTotal && resultTotal.length) {
      totalRows = resultTotal[0].total_rows;
    }
    sql += ` LIMIT ${searchFields.offset * searchFields.itemsPerPage},${
      searchFields.itemsPerPage
    }`;
    executeQuery(select + sql, "getUsers", (result) => {
      //    //console.log(result)
      sortUsersData(haveRole, result, departments, (_data) => {
        let reponse = {
          total: totalRows,
          data: _data,
          page: searchFields.offset,
        };
        callback(reponse);
        return;
      });
    });
  });
}

function getUsersReport(
  haveRole,
  user_id,
  departments,
  searchFields,
  callback
) {
  //    var sql = `select a.*,(select created_at from activities where log_type_id = 5 and user_id=a.user_id order by created_at desc limit 1) as last_login from users a  where a.deleted_at is null `
  var select = `SELECT a.*,a.last_login_date AS last_login  `;
  let sql = ` from users a 
    where a.deleted_at is null`;
  //console.log('getUsers===>', searchFields)
  if (user_id) sql = sql + ` and a.user_id = ${user_id}`;
  if (!haveRole) sql += ` and a.enabled= 1`;

  if (searchFields.startDate) {
    sql += " AND `a`.`created_at` >= '" + searchFields.startDate + "'";
  }
  if (searchFields.endDate) {
    sql += " AND `a`.`created_at` <= '" + searchFields.endDate + "'";
  }

  if (searchFields.name) {
    sql += ` AND a.name LIKE '%${searchFields.name}%'`;
  }
  if (searchFields.username) {
    sql += ` AND a.username LIKE '%${searchFields.username}%'`;
  }
  if (searchFields.email) {
    sql += ` AND a.email LIKE '%${searchFields.email}%'`;
  }
  if (searchFields.phone) {
    sql += ` AND a.phone LIKE '%${searchFields.phone}%'`;
  }
  if (searchFields.accountname) {
    sql += ` AND a.account_name LIKE '%${searchFields.accountname}%'`;
  }
  if (searchFields.is_internal_or_external) {
    sql += ` AND a.department_id = 12`;
  } else {
    sql += ` AND a.department_id != 12`;
  }

  executeQuery(select + sql, "getUsersReport", (result) => {
    sortUsersData(haveRole, result, departments, (_data) => {
      if (_data && _data.length > 0) {
        var fileName =
          new Date().toISOString().replace(/[-:.]/g, "") +
          "user_id" +
          searchFields.user_id;
        if (
          searchFields &&
          searchFields.filterExport &&
          searchFields.filterExport.language &&
          searchFields.filterExport.fileType == 2
        ) {
          createExcelReport
            .usersReportPdf(_data, fileName, searchFields.filterExport, {
              startDate: searchFields.startDate,
              endDate: searchFields.endDate,
            })
            .then((isCreated) => {
              if (isCreated) {
                response = {
                  name: fileName,
                  success: true,
                };
                callback(response);
                return;
              }
              callback(false);
              return;
            });
        } else
          createExcelReport
            .usersExcelReport(_data, fileName, searchFields.filterExport)
            .then((isCreated) => {
              if (isCreated) {
                response = {
                  name: fileName,
                  success: true,
                };
                callback(response);
                return;
              }
              callback(false);
              return;
            });
      } else callback(false);
    });
  });
}

async function handleGetUserSupervisor(
  users,
  role_id,
  approve_or_reject_id,
  callback2
) {
  const arrOfUsers = [];
  for (const item of users) {
    var sqlRoleBase = `
            SELECT per.role_id from  permissions as per
            left join roles ro on per.role_id = ro.role_id
            where per.user_id = ${item?.user_id}
        `;
    var sqlGroupBase = "SELECT group_roles.role_id from user_groups ";
    sqlGroupBase +=
      " left join group_roles on user_groups.group_id = group_roles.group_id ";
    sqlGroupBase +=
      "  left join `groups` on user_groups.group_id = `groups`.id ";
    sqlGroupBase += "  where `groups`.deleted_at is null ";
    sqlGroupBase += "  AND user_groups.user_id = " + item?.user_id;
    var mainQuery = item?.is_group_base_role ? sqlGroupBase : sqlRoleBase;

    let promiseData = await new Promise((resolve) => {
      executeQuery(mainQuery, "getRolesOfrUsers", (result) => {
        resolve(result);
      });
    });
    if (promiseData && promiseData?.length > 0) {
      const uniqueRoleIds = [];
      const seenRoleIds = {};
      promiseData?.forEach((item) => {
        if (!seenRoleIds[item?.role_id]) {
          seenRoleIds[item?.role_id] = true;
          uniqueRoleIds.push(item?.role_id);
        }
      });
      if (
        uniqueRoleIds?.includes(approve_or_reject_id) &&
        uniqueRoleIds?.includes(role_id)
      ) {
        //console.log('DDJJJJJJSSSSSSSSSSSSSSSS====>true');
        arrOfUsers.push(item);
      }
    }
  }
  //console.log('DDJJJJJJSSSSSSSSSSSSSSSS====>end',arrOfUsers);
  callback2(arrOfUsers);
}

function getAllUsersForRoleID(role_id, approve_or_reject_id, callback) {
  try {
    //console.log('DDJJJJJJSSSSSSSSSSSSSSSS====>entered');
    var getUsersSql = `SELECT a.user_id, a.email, a.name, a.is_group_base_role  from users a where a.deleted_at is null `;
    executeQuery(getUsersSql, "getAllUsersForRoleID", (result) => {
      if (result) {
        //console.log('DDJJJJJJSSSSSSSSSSSSSSSS====>got users');
        handleGetUserSupervisor(
          result,
          role_id,
          approve_or_reject_id,
          (result) => {
            callback(result);
          }
        );
      } else {
        callback(false);
      }
    });
  } catch (err) {
    console.error(err);
    callback(false);
  }
}

function getUserByUsername(username, callback) {
  //    var sql = `select a.*,(select created_at from activities where log_type_id = 5 and user_id=a.user_id order by created_at desc limit 1) as last_login from users a  where a.deleted_at is null `
  var sql = `SELECT a.*,a.last_login_date AS last_login from users a  where a.deleted_at is null  and a.username = '${username}' and a.enabled= 1`;

  executeQuery(sql, "getUserByUsername", (result) => {
    callback(result);
  });
}

function getUsersList(dataFields, callback) {
  var haveRole = dataFields?.haveRole,
    department_id = dataFields?.department_id ? dataFields?.department_id : 0,
    is_engineer = dataFields?.is_engineer,
    enabled = dataFields?.enabled,
    has_telegram_id = dataFields?.has_telegram_id
      ? dataFields?.has_telegram_id
      : false;
  var sql = `select a.name,a.phone,a.email,a.user_id,a.department_id,a.is_group_base_role from users a  where a.deleted_at is null `;
  if (department_id) {
    sql += ` AND department_id <> 12 AND department_id=${department_id}`;
  } else {
    sql += ` AND department_id <> 12 `;
  }
  if (!haveRole) {
    sql += ` and a.enabled= 1`;
  } else if (haveRole && enabled) {
    sql += ` and a.enabled= 1`;
  }
  if (is_engineer) sql += ` and a.department_id =9`;

  ////console.log(sql)
  executeQuery(sql, "getUsersList", (result) => {
    callback(result);
    return;
  });
}

async function sortUsersData(haveRole, users, departments, callback) {
  var _data = [],
    i = 0;
  if (users.length == 0) callback([]);
  for (const user of users) {
    await getPermissions(user.user_id, async (_premissions) => {
      if (haveRole)
        _data.push({
          user_id: user.user_id,
          username: user.username,
          wialon_username: user.wialon_username,
          name: user.name,
          email: user.email,
          department: {
            id: user.department_id,
            name:
              departments[user.department_id] == undefined
                ? "Not set"
                : departments[user.department_id],
          },
          phone: user.phone,
          patients_per_day: user.patients_per_day,
          birthdate: user.birthdate,
          created_at: user.created_at,
          enabled: user.enabled,
          last_login: user.last_login,
          account_name: user.account_name,
          image_path: user.image_path,
          telegram_username: user.telegram_username,
          default_route: user.default_route,
          allow_send_email: user?.allow_send_email,
          is_group_base_role: user?.is_group_base_role,
          premissions: _premissions,
        });
      else
        _data.push({
          user_id: user.user_id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          patients_per_day: user.patients_per_day,
          birthdate: user.birthdate,
          department: {
            id: user.department_id,
            name: departments[user.department_id],
          },
          enabled: user.enabled,
          telegram_username: user.telegram_username,
          default_route: user.default_route,
          allow_send_email: user?.allow_send_email,
          is_group_base_role: user?.is_group_base_role,
        });
      i++;
      if (i >= users.length) {
        callback(_data);
      }
    });
  }
}

function sortDepartments(deps, callback) {
  var obj = {};
  function allDone(notAborted, arr) {
    callback(obj);
  }
  forEach(
    deps,
    function (element, index, arr) {
      var key = element.dep_id;
      obj[key] = element.name;
    },
    allDone
  );
}

async function setExpoPushToken(data, callback) {
  try {
    let checkIsSameUser = false;
    let countRecord = 0;
    if (!data.is_logout) {
      var selectSameTokenRecordSql = `select * from expo_fcm_tokens where expo_fcm_tokens.token='${data.token}' AND expo_fcm_tokens.is_other=1`;
      //console.log('QUERY========>selectSameTokenRecordSql ', selectSameTokenRecordSql)
      let resultdata = await new Promise((resolve) => {
        executeQuery(selectSameTokenRecordSql, "setExpoPushToken", (result) => {
          if (result && result.length > 0) {
            countRecord = result.length;
          }
          resolve(result);
        });
      });
    }

    //console.log('QUERY========>countRecord ', countRecord)

    if (countRecord > 0) {
      var updateSql = `update  expo_fcm_tokens set is_other=0,updated_at='${data.updated_at}' where expo_fcm_tokens.token='${data.token}' AND expo_fcm_tokens.is_other=1`;
      //console.log('QUERY========>updateSql ', updateSql)

      let resultdata = await new Promise((resolve) => {
        executeQuery(updateSql, "setExpoPushToken", (result) => {
          if (result) {
            //console.log('EXPO_PUSHTOKEN========>update set all is_other for reacorad that have same  token and is_other input');
          }
          resolve(result);
        });
      });
    }

    if (data.is_logout) {
      var sql = `update  expo_fcm_tokens set is_other=0,updated_at='${data.updated_at}' where expo_fcm_tokens.user_id=${data.user_id} AND expo_fcm_tokens.token='${data.token}' AND expo_fcm_tokens.is_other=1`;
    } else {
      var sql = `
        insert into expo_fcm_tokens 
        ( 
            user_id,
            token,
            is_other,
            created_at,
            updated_at
           ) 
          values(
            "${data.user_id}",
            "${data.token}",
            "${data.is_other}",
            "${data.created_at}",
            "${data.updated_at}"
            )
        `;
    }

    //console.log('QUERY========>sql ', sql)

    executeQuery(sql, "setExpoPushToken", (result) => {
      if (result) {
        //console.log('EXPO_PUSHTOKEN========>operation success', result)
        callback(result);
      } else {
        //console.log('EXPO_PUSHTOKEN========>operation faild')
        callback(false);
      }
    });
  } catch (err) {
    //console.log('EXPO_PUSHTOKEN========>error', err)
  }
}

function copyPermissionsForAnotherUsers(data, callback) {
  var to_user_ids = data.to_user_ids,
    from_user_id = data.from_user_id,
    copy_as_group_base = data.copy_as_group_base;

  function getUserRoles(from_user_id, callback1) {
    executeQuery(
      `select role_id from permissions where user_id=${from_user_id}`,
      "getUserRoles",
      (result) => {
        return callback1(result);
      }
    );
  }
  function removeOldPermissionsForUsers(to_user_ids, callback2) {
    executeQuery(
      `delete from permissions where user_id in (${to_user_ids})`,
      "removeOldPermissionsForUsers",
      (result) => {
        return callback2(result);
      }
    );
  }
  getUserRoles(from_user_id, (getRolesResult) => {
    //   //console.log('getRolesResult====>',getRolesResult);
    if (getRolesResult && getRolesResult.length)
      removeOldPermissionsForUsers(to_user_ids, (result) => {
        //console.log('removeOldPermissionsForUsers==>', result);
        getRoles((roles) => {
          // //console.log(roles)
          const to_user_ids_array = to_user_ids.split(",").map(Number);
          var countActivityINsert = 0;
          for (const set_to_user_id of to_user_ids_array) {
            var i = 0,
              activityRoles = "";
            for (const new_role_id of getRolesResult) {
              activityRoles += roles[new_role_id.role_id] + ", ";
              var sql = `insert into permissions set user_id=${set_to_user_id} , role_id=${new_role_id.role_id}`;
              // //console.log('Query===>',sql)
              executeQuery(sql, "setPermissions", (result) => {
                i++;
                if (i >= getRolesResult.length) {
                  var _sql = `INSERT INTO activities (user_id,user_id_affected,log_type_id,note,created_at) 
                                            VALUES(${
                                              data.user_id
                                            }, ${set_to_user_id}, 4 ,'${activityRoles}' ,'${getDateTime()}') `;
                  // //console.log('Query===>2',_sql)
                  executeQuery(_sql, "setPermissions_activity", (result) => {
                    if (result) {
                      // //console.log('Query===>2',_sql)
                      countActivityINsert++;
                    }
                  });
                }
              });
              // //console.log(activityRoles)
            }
          }
          callback(true);
        });
      });
    else return callback("no roles");
  });
}

function copyPermissionsForAnotherUsersByGroup(data, callback) {
  var to_user_ids = data.to_user_ids,
    from_user_id = data.from_user_id,
    copy_as_group_base = data.copy_as_group_base;

  function getGroupIds(from_user_id, callback1) {
    var querGet = "SELECT user_groups.group_id from user_groups ";
    querGet += " left join `groups` on user_groups.group_id = `groups`.id";
    querGet += " left join users on user_groups.user_id = users.user_id ";
    querGet += " where `groups`.deleted_at is null ";
    querGet +=
      " AND user_groups.user_id = " +
      from_user_id +
      " AND users.is_group_base_role=1";
    executeQuery(querGet, "getGroupIds", (result) => {
      return callback1(result);
    });
  }
  function removeOldPermissionsForUsers(to_user_ids, callback2) {
    executeQuery(
      `delete from user_groups where user_id in (${to_user_ids})`,
      "removeOldPermissionsForUsers",
      (result) => {
        return callback2(result);
      }
    );
  }
  getGroupIds(from_user_id, (getGroupResult) => {
    //   //console.log('getRolesResult====>',getRolesResult);
    if (getGroupResult && getGroupResult.length)
      removeOldPermissionsForUsers(to_user_ids, (result) => {
        //console.log('removeOldPermissionsForUsers==>', result);
        const to_user_ids_array = to_user_ids.split(",").map(Number);
        var countActivityINsert = 0;
        let query = `insert into user_groups (user_id, group_id) values `;
        for (const set_to_user_id of to_user_ids_array) {
          for (const groupItem of getGroupResult) {
            query += `(${set_to_user_id},${groupItem?.group_id})`;
          }
        }
        executeQuery(query, "setUserGroupsCopyOptions", (result) => {
          if (result && result?.affectedRows > 0) {
            callback(true);
          } else {
            callback(false);
          }
        });
      });
    else return callback("no groups or user not base on groups");
  });
}

function handleAllowSendEmail(data, callback) {
  const updateQuery = `update users set allow_send_email=${data?.allow_send_email} where user_id=${data?.req_user_id}`;
  executeQuery(updateQuery, "handleAllowSendEmail", (result) => {
    //console.log('asdasdasdasdasdsa=======>', result)
    if (result && result?.affectedRows > 0)
      return callback(getRes(true, null, messages.updated));
    else callback(getRes(false, null, messages.error));
  });
}

module.exports = {
  getDateTime,
  checkUsernameOrIdExisting,
  checkDepartmentId,
  getPermissions,
  checkOldPassword,
  updateUserPassword,
  getUsers,
  getUsersList,
  sortDepartments,
  insertUser,
  updateUserDetails,
  setPermissions,
  enableUser,
  getNewPermissions,
  getUserByUsername,
  getAllUsersForRoleID,
  setExpoPushToken,
  getUsersReport,
  copyPermissionsForAnotherUsers,
  handleAllowSendEmail,
  getNewPermissionsAccordingUserBase,
  copyPermissionsForAnotherUsersByGroup,
};
