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

router.post("/prescription_details/:id", (req, res) => {
  financeTypeController.insertTaskFinances(req, (response) => {
    res.json(response);
  });
});

router.put("/prescription_details/:id", (req, res) => {
  financeTypeController.updateTaskFinances(req, (response) => {
    res.json(response);
  });
});

module.exports = router;
