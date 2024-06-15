const express = require("express");
const router = express.Router();
const financeTypeController = require("./financeTaskDetailsController");

router.get("/", (req, res) => {
  financeTypeController.getFinanceTaskDetails(req, (response) => {
    res.json(response);
  });
});

router.post("/:task_id", (req, res) => {
  financeTypeController.createFinanceTaskDetails(req, (response) => {
    res.json(response);
  });
});

router.put("/:device_statuses_id", (req, res) => {
  financeTypeController.updateFinanceTaskDetails(req, (response) => {
    res.json(response);
  });
});

router.delete("/:device_statuses_id", (req, res) => {
  financeTypeController.deleteFinanceTaskDetails(req, (response) => {
    res.json(response);
  });
});

module.exports = router;
