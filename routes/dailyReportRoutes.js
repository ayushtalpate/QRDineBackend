const express = require("express");
const router = express.Router();
const DailyReport = require("../models/DailyReport");
const mongoose = require('mongoose');


router.get("/", async (req, res) => {
  try {
    const reports = await DailyReport.find().sort({ date: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Failed to fetch daily reports:", error);
    res.status(500).json({ error: "Failed to fetch daily reports" });
  }
});



module.exports = router;
