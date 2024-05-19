var mod = require("./models");
var auth = require("../../jwt/auth");

function tempController(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      mod.tempModel(req, (result) => {
        response({ status: false, data: result });
      });
    } else response({ status: false, data: { message: msg.invalidToken } });
  });
}

module.exports = {
  tempController,
};
