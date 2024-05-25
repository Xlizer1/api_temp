var auth = require("../../jwt/auth");
var msg = require("../../helper/messages");
var executeQuery = require("../../helper/common").executeQuery;
const bcrypt = require("bcrypt");

function createToken(req, response) {
  // console.log(req);
  const username = req.body.username;
  const password = req.body.password;
  const device_type = req.body.device_type ? req.body.device_type : "unknown";
  var sql = 'select * from users where username = "' + username + '" ';
  executeQuery(sql, "createToken", (result) => {
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, function (err, _result) {
        if (_result) {
          if (result[0].enabled == 1) var roles_id = [];
          var task_type_id = [];
          var suppliers_id = [];

          var _token = auth.generate(
            {
              user_id: result[0].user_id,
              username: result[0].username,
              user_department_id: result[0].department_id,
              suppliers_id: suppliers_id,
              roles_id: roles_id,
              task_type_id: task_type_id,
              erp_employee_code: result[0].erp_employee_code,
              is_group_base_role: result[0].is_group_base_role,
            },
            device_type == "mobile"
          );
          response({
            status: true,
            data: {
              user_id: result[0].user_id,
              username: result[0].username,
              email: result[0].email,
              roles: roles_id,
              erp_employee_code: result[0].erp_employee_code,
              user_department_id: result[0].department_id,
              token: _token,
              default_route: result[0].default_route,
              user_image: [],
              is_group_base_role: result[0].is_group_base_role,
            },
          });
        } else response({ status: false, data: msg.invalidPassword });
      });
    } else response({ status: false, data: msg.invalidLogin });
  });
}

function checkToken(req, response) {
  var token = req.body.token;
  auth.verify(token, (res) => {});
  response(null);
}

module.exports = { createToken, checkToken };
