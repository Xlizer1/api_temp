const express = require("express");
const router = express.Router();
const financeTypeController = require("./appointmentRequestsController");

router.get("/", (req, res) => {
  financeTypeController.getAppointmentRequests(req, (response) => {
    res.json(response);
  });
});

router.get("/page", (req, res) => {
  financeTypeController.getAppointmentRequestsPage(req, (response) => {
    res.json(response);
  });
});

router.post("/", (req, res) => {
  financeTypeController.createAppointmentRequests(req, (response) => {
    res.json(response);
  });
});

router.delete("/:id", (req, res) => {
  financeTypeController.deleteAppointmentRequests(req, (response) => {
    res.json(response);
  });
});

router.put("/status", (req, res) => {
  financeTypeController.changeAppointmentRequestsStatus(req, (response) => {
    res.json(response);
  });
});

module.exports = router;
