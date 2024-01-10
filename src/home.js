const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ app_name: "Restaurants Menu Api", ver: "1.0.0" });
});

module.exports = router;
