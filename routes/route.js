const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
require("../models/db");
const { default: mongoose } = require("mongoose");
const Swap = mongoose.model("Swap");

module.exports = router;

/**
 * @get all
 *
 */
router.get("/", async (req, res) => {
  const swapres = await Swap.find({}).limit(10);
  res.send(swapres);
});
