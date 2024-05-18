const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/", (req, res) => {
  controller.getUsers(req, (response) => {
    res.json(response);
  });
});

router.post("/login", (req, res) => {
  controller.createToken(req, (response) => {
    res.json(response);
  });
});

router.post("/register", (req, res) => {
  controller.createNewUser(req, (response) => {
    res.json(response);
  });
});

module.exports = router;
