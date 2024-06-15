const mysql = require('mysql');

const host = process.env.HOST === undefined ? 'localhost':process.env.HOST;
const user = process.env.DB_USER === undefined ? 'root':process.env.DB_USER;
const password = process.env.PASSWORD === undefined ? '' : process.env.PASSWORD;
const database = process.env.DATABASE === undefined ? 'care_pulse':process.env.DATABASE;

let con;

/* db connection with retry */
function connectWithRetry() {
  console.log('Trying to connect to the DB');
  con = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
    multipleStatements: true,
    charset: 'utf8',
    queryTimeout: 5000, // 5 seconds query timeout,
    timezone:'Asia/Baghdad',
  });

  con.connect((err) => {
    if (err) {
      console.error('Error in DB connection:', err);
      console.log('Retrying DB connection in 5 seconds...');

      // Retry the connection after a delay
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('DB Connected to:', database);
    }
  });

  con.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection lost');
      console.log('Retrying DB connection in 5 seconds...');

      // Retry the connection after a delay
      setTimeout(connectWithRetry, 5000);
    } else {
      console.error('Fatal error encountered, creating a new DB connection');
      con.destroy(); // Destroy the existing connection

      // Retry the connection immediately
      connectWithRetry();
    }
  });
}

// Start the DB connection with retry
connectWithRetry();

// const queryTimeout = 5000; // 5 seconds query timeout

// const query = con.query('SELECT SLEEP(10)', (error, results) => {
//   if (error) {
//     if (error.fatal) {
//       console.error('Connection error:', error);
//     } else {
//       console.error('Query error:', error);
//     }
//   } else {
//     console.log('Results:', results);
//   }
// });

// // Simulate a query timeout by forcefully closing the connection after the timeout period
// setTimeout(() => {
//   con.destroy(); // This will close the connection, canceling the query
//   console.error('Query timed out.');
//   con.query('SELECT 1', (error, results) => {
//     if (error) {
//       if (error.fatal) {
//         console.error('Connection error:', error);
//       } else {
//         console.error('Query error:', error);
//       }
//     } else {
//       console.log('Results:', results);
//     }
//   })
// }, queryTimeout);

module.exports.mysqlConnection = con
module.exports.query = function (...args) {
  if (con && con.state === 'authenticated') {
    con.query(...args, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
      } else {
        console.log('Query executed successfully:', results);
      }
    });
  } else {
    console.error('Cannot execute query, no valid DB connection available');
    connectWithRetry();
  }
};
