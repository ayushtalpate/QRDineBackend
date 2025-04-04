const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  tableId: {
    type: String,
    required: true,
  },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  paymentType: {
    type: String,
    enum: ["Pay After", "Online"],
    default: "Pay After",
  },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Served", "Completed"],
    default: "Pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
