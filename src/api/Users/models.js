const executeQuery = require("../../helper/common").executeQuery;
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function createNewUser(data, userDetails, callback) {
  try {
    const { user_id } = data;
    const { first_name, last_name, username, password, email, role_id, phone, enabled, birthdate } = userDetails;
    bcrypt
      .hash(password, saltRounds)
      .then(function (hashedPassword) {
        var sql = `
          INSERT INTO
            users
          SET (
            first_name,
            last_name,
            username,
            password,
            email,
            role_id,
            phone,
            enabled,
            birthdate,
            created_by,
            created_at
          )
          VALUES (
            ${first_name},
            ${last_name},
            ${username},
            ${hashedPassword},
            ${email},
            ${role_id},
            ${phone},
            ${enabled},
            ${birthdate},
            ${user_id},
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

module.exports = {
  createNewUser,
};
