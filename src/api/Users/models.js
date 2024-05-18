const executeQuery = require("../../helper/common").executeQuery;
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function createNewUser(data, req, callback) {
  try {
    const { first_name, last_name, password, email, role_id, phone, gender, birthdate } = req.body;
    bcrypt.hash(password, saltRounds).then(function (hashedPassword) {
      var sql = `
        INSERT INTO users (
          first_name,
          last_name,
          email,
          password,
          phone,
          birthdate,
          gender,
          role_id,
          enabled,
          created_by,
          created_at
        ) VALUES (
          "${first_name}",
          "${last_name}",
          "${email}",
          "${hashedPassword}",
          "${phone}",
          "${birthdate}",
          ${gender},
          ${role_id},
          ${0},
          ${1},
          NOW()
        )
      `;
      executeQuery(sql, "createNewUser", (result) => {
        callback(result);
      });
    });
  } catch (error) {
    callback(false);
    console.log(error);
  }
}

async function getUsers(req, callback) {
  try {
      var sql = `
        SELECT
          *
        FROM
          users
      `;
      executeQuery(sql, "getUsers", (result) => {
        callback(result);
      });
  } catch (error) {
    callback(false);
    console.log(error);
  }
}


module.exports = {
  createNewUser,
  getUsers,
};
