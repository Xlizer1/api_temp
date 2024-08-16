const express = require("express");
const router = express.Router();
const recentVisitorController = require("./recentVisitorController");

router.get("/", (req, res) => {
  recentVisitorController.getRecentVisitor(req, (response) => {
    res.json(response);
  });
});

module.exports = router;
