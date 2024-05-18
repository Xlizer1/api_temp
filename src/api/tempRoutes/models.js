const executeQuery = require("../../helper/common").executeQuery;

function check(req, callback) {
  callback({ msg: "لك ها سوسو" });
}

module.exports = {
  check,
};
