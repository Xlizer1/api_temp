const express = require("express");
const router = express.Router();
const getAppointmentsRequestsStatuses = require("./appointmentsRequestsStatusesController");

router.get("/", (req, res) => {
  getAppointmentsRequestsStatuses.getAppointmentsRequestsStatuses(req, (response) => {
    res.json(response);
  });
});

module.exports = router;
