const app = require("./src/config/setup");
const cors = require("cors");
require("dotenv").config();

const home = require("./src/home");
const tempRoutes = require("./src/api/tempRoutes/routes");
const users = require("./src/api/Users/routes");
const loginRoutes = require('./src/api/login/loginRoutes');

app.use(cors());
app.use("/", home);
app.use("/check", tempRoutes);
app.use("/users", users);
app.use('/login', loginRoutes);

module.exports = app;
