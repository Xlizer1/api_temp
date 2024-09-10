const express = require("express");
const router = express.Router();
const controller = require("./appointmentsStatusesController");

router.get("/", (req, res) => {
  controller.getPrescriptionStatuses(req, (response) => {
    res.json(response);
  });
});

module.exports = router;
