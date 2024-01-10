const app = require("./src/config/setup");
const cors = require("cors");
require("dotenv").config();

const home = require("./src/home");
const tempRoutes = require("./src/api/tempRoutes/routes");

app.use(cors());
app.use("/", home);
app.use("/check", tempRoutes);

module.exports = app;
