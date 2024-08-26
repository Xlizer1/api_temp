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

// router.put("/:finance_type_id", (req, res) => {
//   financeTypeController.updateFinanceType(req, (response) => {
//     res.json(response);
//   });
// });

// router.delete("/:finance_type_id", (req, res) => {
//   financeTypeController.deleteFinanceType(req, (response) => {
//     res.json(response);
//   });
// });

module.exports = router;
