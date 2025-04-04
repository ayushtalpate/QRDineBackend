const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    desc: String,
    price: Number,
    image: {
        data: Buffer, // Binary image data
        contentType: String // Image type (e.g., "image/png")
    }
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
