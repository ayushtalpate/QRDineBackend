// models/QRCodeModel.js
const mongoose = require('mongoose');

const QRCodeSchema = new mongoose.Schema({
  tableId: {
    type: Number,
    required: true,
    unique: true,  // Make sure tableId is unique
  },
  qrCodeImage: {
    type: String,
    required: true,  // Store the QR code image as a base64 string
  },
  qrCodeUrl: {
    type: String,
    required: true,  // URL for the generated QR code
  },
});

module.exports = mongoose.model('QRCode', QRCodeSchema);
