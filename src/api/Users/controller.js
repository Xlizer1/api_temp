var mod = require("./models");
var auth = require("../../jwt/auth");

function createNewUser(req, response) {
  auth.verify(req.headers["jwt"], (data) => {
    if (data) {
      mod.createNewUser(req, (result) => {
        response({ status: false, data: result });
      });
    } else response({ status: false, data: { message: msg.invalidToken } });
  });
}

module.exports = {
  createNewUser,
};
