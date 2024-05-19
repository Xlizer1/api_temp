const executeQuery = require("../../helper/common").executeQuery;

function tempModel(req, callback) {
  callback({ msg: "لك ها سوسو" });
}

module.exports = {
  tempModel,
};
