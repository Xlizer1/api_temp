const express = require("express");
const router = express.Router();
const getAppointmentsStatuses = require("./appointmentsStatusesController");

router.get("/", (req, res) => {
  getAppointmentsStatuses.getAppointmentsStatuses(req, (response) => {
    res.json(response);
  });
});

module.exports = router;
