const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
    try {
      const { tableId, items, paymentType } = req.body;
  
      if (!tableId || !items || !items.length) {
        return res.status(400).json({ error: "Missing order details" });
      }
  
      const existingOrder = await Order.findOne({
        tableId,
        status: { $in: ["Pending", "Preparing"] },
      });
  
      if (existingOrder) {
        return res.status(400).json({
          error: " You already have an order in progress. Please wait until it's completed.",
        });
      }
  
      const order = new Order({
        tableId,
        items,
        paymentType,
        status: "Pending", // Set initial status
      });
  
      await order.save();
      res.status(201).json({ message: " Order placed successfully", order });
  
    } catch (error) {
      console.error("Order error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  

router.get("/", async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const orderId = req.params.id;
      const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, {
        new: true,
      });
  
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      res.json(updatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const deletedOrder = await Order.findByIdAndDelete(req.params.id);
  
      if (!deletedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      res.json({ message: "Order deleted successfully" });
    } catch (err) {
      console.error("Error deleting order:", err);
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

module.exports = router;
