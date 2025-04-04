const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");


const qr = require("qrcode");
const QRCodeModel = require("../models/QRCodeModel");

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL

// ✅ Generate and Store QR Code
router.post("/", async (req, res) => {
  try {
    const { tableId } = req.body;
    if (!tableId) return res.status(400).json({ message: "❌ Table ID is required" });

    const qrCodeUrl = `${FRONTEND_URL}/table/${tableId}`;

    // ✅ Check if QR Code already exists
    let qrCode = await QRCodeModel.findOne({ tableId });
    if (qrCode) {
      return res.status(200).json({
        message: "✅ QR Code already exists",
        qrCodeImage: qrCode.qrCodeImage,
        qrCodeUrl: qrCode.qrCodeUrl,
      });
    }

    // ✅ Generate New QR Code
    const qrCodeImage = await qr.toDataURL(qrCodeUrl);
    qrCode = new QRCodeModel({ tableId, qrCodeImage, qrCodeUrl });
    await qrCode.save();

    res.status(201).json({ message: "✅ QR Code generated", qrCodeImage, qrCodeUrl });
  } catch (error) {
    console.error("❌ Error generating QR code:", error);
    res.status(500).json({ message: "Error generating QR code" });
  }
});

// ✅ Fetch All QR Codes
router.get("/", async (req, res) => {
  try {
    const qrCodes = await QRCodeModel.find();
    res.status(200).json(qrCodes);
  } catch (error) {
    console.error("❌ Error fetching QR codes:", error);
    res.status(500).json({ message: "Error fetching QR codes" });
  }
});

// ✅ Fetch Single QR Code by Table ID
router.get("/:tableId", async (req, res) => {
  try {
    const qrCode = await QRCodeModel.findOne({ tableId: req.params.tableId });
    if (!qrCode) return res.status(404).json({ message: "❌ QR Code not found" });

    res.json(qrCode);
  } catch (error) {
    console.error("❌ Error fetching QR code:", error);
    res.status(500).json({ message: "Error fetching QR code" });
  }
});

// ✅ Delete QR Code by Table ID
router.delete("/:tableId", async (req, res) => {
  try {
    const deletedQRCode = await QRCodeModel.findOneAndDelete({ tableId: req.params.tableId });
    if (!deletedQRCode) return res.status(404).json({ message: "❌ QR Code not found" });

    res.status(200).json({ message: "✅ QR Code deleted" });
  } catch (error) {
    console.error("❌ Error deleting QR code:", error);
    res.status(500).json({ message: "Error deleting QR code" });
  }
});

module.exports = router;
