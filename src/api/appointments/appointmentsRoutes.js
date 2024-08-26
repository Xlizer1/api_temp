const express = require("express");
const router = express.Router();
const appointmentsController = require("./appointmentsController");

router.get("/", (req, res) => {
  appointmentsController.getAppointments(req, (response) => {
    res.json(response);
  });
});

router.post("/", (req, res) => {
  appointmentsController.createAppointments(req, (response) => {
    res.json(response);
  });
});

router.put("/:appo_id", (req, res) => {
  appointmentsController.updateAppointments(req, (response) => {
    res.json(response);
  });
});

router.put("/done/:appo_id", (req, res) => {
  appointmentsController.updateAppointmentsDone(req, (response) => {
    res.json(response);
  });
});

router.delete("/:appo_id", (req, res) => {
  appointmentsController.deleteAppointments(req, (response) => {
    res.json(response);
  });
});

module.exports = router;
