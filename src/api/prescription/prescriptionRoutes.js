const express = require("express");
const router = express.Router();
const financeTypeController = require("./prescriptionController");

router.get("/", (req, res) => {
  financeTypeController.getPrescription(req, (response) => {
    res.json(response);
  });
});

router.post("/", (req, res) => {
  financeTypeController.createPrescription(req, (response) => {
    res.json(response);
  });
});

router.put("/", (req, res) => {
  financeTypeController.updatePrescription(req, (response) => {
    res.json(response);
  });
});

router.put("/status", (req, res) => {
  financeTypeController.changePrescriptionStatus(req, (response) => {
    res.json(response);
  });
});

module.exports = router;
