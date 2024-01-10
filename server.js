require("dotenv").config();
require("./src/config/db");
const http = require("http");
const app = require("./app");
const port =
  process.env.SERVER_PORT === undefined ? 3001 : process.env.SERVER_PORT;
const ip =
  process.env.SERVER_HOST === undefined ? "localhost" : process.env.SERVER_HOST;

let server = http.createServer(app);

server.listen(port);

console.log("**************", ip + ":" + port, "**************");
