const mongoose = require("mongoose");

const dailyReportSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
});



module.exports = mongoose.model("DailyReport", dailyReportSchema);
