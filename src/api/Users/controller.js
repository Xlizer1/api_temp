var mod = require("./models");
var auth = require("../../jwt/auth");
var executeQuery = require("../../helper/common").executeQuery;
const bcrypt = require("bcrypt");

function createToken(req, response) {
  const phone = req.body.phone;
  const password = req.body.password;
  const device_type = req.body.device_type ? req.body.device_type : "unknown";
  var sql = 'select * from users where phone = "' + phone + '" ';
  executeQuery(sql, "createToken", (result) => {
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, function (err, _result) {
        if (_result) {
          var _token = auth.generate(
            {
              user_id: result[0].id,
              first_name: result[0].first_name,
              last_name: result[0].last_name,
              role_id: result[0].role_id,
            },
            device_type
          );
          response({
            status: true,
            token: _token,
          });
        } else response({ status: false, data: "wrong password" });
      });
    } else response({ status: false, data: "" });
  });
}

function createNewUser(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      mod.createNewUser({}, req, (result) => {
        response({ status: false, data: result });
      });
    } else response({ status: false, data: { message: msg.invalidToken } });
  });
}

function getUsers(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      mod.getUsers(req, (result) => {
        response({ status: false, data: result });
      });
    } else response({ status: false, data: { message: "" } });
  });
}

module.exports = {
  createNewUser,
  createToken,
  getUsers,
};
