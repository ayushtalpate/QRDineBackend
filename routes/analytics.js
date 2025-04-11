const express = require("express");
const router = express.Router();
const QRCode = require("../models/QRCodeModel");
const Order = require("../models/Order");
const DailyReport = require("../models/DailyReport");

const moment = require("moment");

router.get("/dashboard-summary", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await DailyReport.aggregate([
      { $group: { _id: null, total: { $sum: "$totalRevenue" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const uniqueTables = await DailyReport.distinct("tableId");
    const totalUsers = uniqueTables.length;

    const now = new Date();
    const startOfThisMonth = moment(now).startOf("month").toDate();
    const startOfLastMonth = moment(now).subtract(1, "month").startOf("month").toDate();
    const endOfLastMonth = moment(now).subtract(1, "month").endOf("month").toDate();

    const currentMonth = await DailyReport.aggregate([
      { $match: { date: { $gte: startOfThisMonth } } },
      { $group: { _id: null, total: { $sum: "$totalRevenue" } } }
    ]);
    const lastMonth = await DailyReport.aggregate([
      { $match: { date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, total: { $sum: "$totalRevenue" } } }
    ]);

    const currentMonthRevenue = currentMonth[0]?.total || 0;
    const lastMonthRevenue = lastMonth[0]?.total || 0;

    const growthPercentage = lastMonthRevenue === 0
      ? 100
      : Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);

    const revenueData = await DailyReport.find({}, { date: 1, totalRevenue: 1 }).sort({ date: 1 });

    res.status(200).json({
      totalOrders,
      totalRevenue,
      totalUsers,
      revenueData,
      currentMonthRevenue,
      lastMonthRevenue,
      growthPercentage,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
