// controllers/orderController.js
const Order = require("../models/Order");

const placeOrder = async (req, res) => {
  try {
    const { tableId, items } = req.body;

    // 🔍 Check if an order with status Pending or Preparing already exists
    const existingOrder = await Order.findOne({
      tableId,
      status: { $in: ["Pending", "Preparing"] },
    });

    if (existingOrder) {
      return res.status(400).json({
        message: "⚠️ You already have an order in progress. Please wait until it's completed.",
      });
    }

    // ✅ Create new order
    const newOrder = new Order({
      tableId,
      items,
      status: "Pending",
    });

    await newOrder.save();
    res.status(201).json({ message: "✅ Order placed successfully", order: newOrder });

  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  placeOrder,
};
