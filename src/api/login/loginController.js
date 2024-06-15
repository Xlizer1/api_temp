var db = require("../../config/db");
var auth = require("../../jwt/auth");
var userModules = require("../users/userModels");
var msg = require("../../helper/messages");
var executeQuery = require("../../helper/common").executeQuery;
var getDateTime = require("../../helper/common").getDateTime;
const bcrypt = require("bcrypt");

function createToken(req, response) {
  // console.log(req);
  const username = req.body.username;
  const password = req.body.password;
  const device_type = req.body.device_type ? req.body.device_type : "unknown";
  const expo_token = req.body.expo_token ? req.body.expo_token : "unknown";
  var sql = 'select * from users where username = "' + username + '" ';
  executeQuery(sql, "createToken", (result) => {
    if (result.length > 0) {
      bcrypt.hash(password, 10).then(function (hashedPassword) {
        // console.log(hashedPassword);
      });
      // console.log(result[0].password);
      bcrypt.compare(password, result[0].password, function (err, _result) {
        // console.log(_result);
        if (_result) {
          if (result[0].enabled == 1)
            userModules.getNewPermissionsAccordingUserBase(result[0], async (permissions) => {
              // return roles and specific task ids that can be viewed
              var roles_id = [],
                task_type_id = []
              if (permissions)
                permissions.forEach((element) => {
                  if (element.role_id) roles_id.push(element.role_id);
                  else task_type_id.push(element.task_type_id);
                });
                var _token = auth.generate(
                  {
                    user_id: result[0].user_id,
                    username: result[0].username,
                    user_department_id: result[0].department_id,
                    roles_id: roles_id,
                    task_type_id: task_type_id,
                    erp_employee_code: result[0].erp_employee_code,
                    is_group_base_role: result[0].is_group_base_role
                  },
                  device_type == "mobile"
                );
              console.log("token: " + _token);
              sql = `insert into activities set log_type_id=5 ,user_id= ${result[0].user_id},note= '${username} login successfully from ${device_type}' ,created_at=now() `;
              executeQuery(sql, "login_activity", (res) => {
                sql = `update users set expo_token='${expo_token}',last_login_date=now() where username='${username}' and deleted_at is null and enabled=1`;
                executeQuery(sql, "login_expo", (res) => {
                  let getUserImage = `select user_images.path from user_images where user_images.user_id=${result[0].user_id} and user_images.is_default=1`;
                  // console.log(_token)
                  executeQuery(getUserImage, "get user images", (getImagesRresult) => {
                    console.log('GETUSERIMAGFES====>', getImagesRresult)
                    if (getImagesRresult && getImagesRresult.length)
                      response({
                        status: true,
                        data: {
                          user_id: result[0].user_id,
                          username: result[0].username,
                          email: result[0].email,
                          roles: roles_id,
                          erp_employee_code: result[0].erp_employee_code,
                          task_type_id: task_type_id,
                          user_department_id: result[0].department_id,
                          token: _token,
                          expo_token: expo_token,
                          user_image: getImagesRresult,
                          default_route: result[0].default_route,
                          is_group_base_role: result[0].is_group_base_role
                        },
                      });
                    else
                      response({
                        status: true,
                        data: {
                          user_id: result[0].user_id,
                          username: result[0].username,
                          email: result[0].email,
                          roles: roles_id,
                          erp_employee_code: result[0].erp_employee_code,
                          task_type_id: task_type_id,
                          user_department_id: result[0].department_id,
                          token: _token,
                          expo_token: expo_token,
                          default_route: result[0].default_route,
                          user_image: [],
                          is_group_base_role: result[0].is_group_base_role

                        },
                      });
                  });
                });
              });
            });
          else response({ status: false, data: msg.userDisabled });
        } else response({ status: false, data: msg.invalidPassword });
      });
    } else response({ status: false, data: msg.invalidLogin });
  });
}

function checkToken(req, response) {
  var token = req.body.token;
  auth.verify(token, (res) => { });
  response(null);
}

module.exports = { createToken, checkToken };
