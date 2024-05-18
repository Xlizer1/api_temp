const mysql = require("mysql");

const host =
  process.env.SERVER_HOST === undefined ? "localhost" : process.env.SERVER_HOST;
const user = process.env.DB_USER === undefined ? "root" : process.env.DB_USER;
const password = process.env.PASSWORD === undefined ? "" : process.env.PASSWORD;
const database = process.env.DATABASE === undefined ? "care_pulse" : process.env.DATABASE;

let con;

function connectWithRetry() {
  if (database) {
    console.log("Trying to connect to the DB");
    con = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database,
      multipleStatements: true,
      charset: "utf8",
      queryTimeout: 5000,
      timezone: "KSA",
    });

    con.connect((err) => {
      if (err) {
        console.error("Error in DB connection:", err);
        console.log("Retrying DB connection in 5 seconds...");

        setTimeout(connectWithRetry, 5000);
      } else {
        console.log("DB Connected to:", database);
      }
    });

    con.on("error", (err) => {
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.error("Database connection lost");
        console.log("Retrying DB connection in 5 seconds...");

        setTimeout(connectWithRetry, 5000);
      } else {
        console.error("Fatal error encountered, creating a new DB connection");
        con.destroy();
        connectWithRetry();
      }
    });
  } else {
    console.error(
      "Error encountered, No DB name...\nPlease configure your DB info in the .env file"
    );
  }
}

connectWithRetry();

module.exports.mysqlConnection = con;
module.exports.query = function (...args) {
  if (con && con.state === "authenticated") {
    con.query(...args, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
      } else {
        console.log("Query executed successfully:", results);
      }
    });
  } else {
    console.error("Cannot execute query, no valid DB connection available");
    connectWithRetry();
  }
};
