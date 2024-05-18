const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/", (req, res) => {
  controller.check(req, (response) => {
    res.json(response);
  });
});

module.exports = router;
