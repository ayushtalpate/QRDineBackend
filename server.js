const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const menuRoutes = require("./routes/menuRoutes");
const qrcodeRoutes = require("./routes/qrCodeRoutes");
const orderRoutes = require("./routes/orderRoutes")
const analyticsRoutes = require('./routes/analytics');
const dailyReportRoutes = require("./routes/dailyReportRoutes");

const razorpayRoutes = require("./routes/razorpay");


// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
};
connectDB();

// ✅ Routes
app.use("/api/menu", menuRoutes);
app.use("/api/qrcode", qrcodeRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use("/uploads", express.static("uploads"));
app.use("/api/orders", orderRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/daily-reports", dailyReportRoutes);




// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
