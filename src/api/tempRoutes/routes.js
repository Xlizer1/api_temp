const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/", (req, res) => {
  controller.tempController(req, (response) => {
    res.json(response);
  });
});

module.exports = router;
