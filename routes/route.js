const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
require("../models/db");
const { default: mongoose } = require("mongoose");
const Swap = mongoose.model("Swap");

module.exports = router;

//Post Method
router.get("/", async (req, res) => {
  const swapres = await Swap.find({}).limit(10);
  res.send(swapres);
});

//Post Method
router.post("/post", (req, res) => {
  res.send("Post API");
});

//Get all Method
router.get("/getAll", (req, res) => {
  res.send("Get All API");
});

//Get by ID Method
router.get("/tx/:id", async (req, res) => {
  const swapres = await Swap.find({ txhash: req.params.id });
  console.log(req.params);
  res.send(swapres);
});

//Update by ID Method
router.get("/job/:id", async (req, res) => {
  const swapres = await Swap.find({ bullJobId: req.params.id });
  console.log(req.params);
  res.send(swapres);
});

//Delete by ID Method
router.delete("/delete/:id", (req, res) => {
  res.send("Delete by ID API");
});
