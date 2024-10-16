const express = require("express");
const app = require("./src/config/setup");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const loginRoutes = require("./src/api/login/loginRoutes");
const usersRoutes = require("./src/api/users/userRoutes");
const roleRoutes = require("./src/api/roles/rolesRoutes");
const departmentRoutes = require("./src/api/departments/depRoutes");
const notificationRoutes = require("./src/api/notifications/notificationRoutes");
const settingsRoutes = require("./src/api/settings/settingsRoutes");
const userImagesRoutes = require("./src/api/UserImages/UserImageRoutes");
const appointmentsStatuses = require("./src/api/appointmentsStatuses/appointmentsStatusesRoutes.js");

const groupRoutes = require("./src/api/groups/groupRoutes.js");
const userGroupRoutes = require("./src/api/userGroups/userGroupRoutes.js");
const updateContentRoutes = require("./src/api/updateContent/updateContentRoutes.js");

const appointmentsRoutes = require("./src/api/appointments/appointmentsRoutes.js");
const prescriptionRoutes = require("./src/api/prescription/prescriptionRoutes.js");
const appointmentRequestsRoutes = require("./src/api/appointmentRequests/appointmentRequestsRoutes.js");
const appointmentsRequestsStatusesRoutes = require("./src/api/appointmentsRequestsStatuses/appointmentsRequestsStatusesRoutes.js");

const home = require("./src/helper/home");
const handleRecordingUsersHit = require("./src/api/handleRecordingUsersHit.js");

app.use(handleRecordingUsersHit);

app.use("/uploads", express.static(__dirname + "/dist/uploads"));
app.use(
  "/uploads/files",
  express.static(path.join(__dirname, "/../../../dist/uploads/files"))
);

app.use(cors());

app.use("/login", loginRoutes);
app.use("/users", usersRoutes);
app.use("/roles", roleRoutes);
app.use("/departments", departmentRoutes);
app.use("/notifications", notificationRoutes);
app.use("/setting", settingsRoutes);

app.use("/user_images", userImagesRoutes);
app.use("/groups", groupRoutes);
app.use("/user_groups", userGroupRoutes);
app.use("/update_contents", updateContentRoutes);
app.use("/appointments_statuses", appointmentsStatuses);
app.use("/appointment_requests", appointmentRequestsRoutes);
app.use("/requests_statuses", appointmentsRequestsStatusesRoutes);
app.use("/prescription_statuses", appointmentsStatuses);
app.use("/appointments", appointmentsRoutes);
app.use("/prescription", prescriptionRoutes);

app.use("/", home);

module.exports = app;
