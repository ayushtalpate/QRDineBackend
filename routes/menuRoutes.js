const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const MenuItem = require("../models/MenuItem"); 
require("dotenv").config();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// ✅ Multer Storage (Temporary Store in Memory Before Saving to MongoDB)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ GET all menu items
router.get("/", async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching menu items", error });
    }
});

// ✅ POST: Upload and Store Image in MongoDB
router.post("/", upload.single("image"), async (req, res) => {
    try {
      

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        if (!req.body.name || !req.body.price) {
            return res.status(400).json({ message: "Name and price are required" });
        }

        const newItem = new MenuItem({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            desc: req.body.desc || "",
            price: req.body.price,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        await newItem.save();
        res.status(201).json({ message: "Menu item added successfully", newItem });
    } catch (error) {
        console.error("❌ Error adding menu item:", error);
        res.status(500).json({ message: "Server error", error });
    }
});




router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const deletedItem = await MenuItem.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Item deleted successfully", deletedItem });
    } catch (error) {
        console.error("❌ Error deleting item:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Serve image by item ID
router.get("/image/:id", async (req, res) => {
    try {
        const itemId = req.params.id.trim(); // Trim any extra spaces or newlines

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const item = await MenuItem.findById(itemId);
        if (!item || !item.image || !item.image.data) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.set("Content-Type", item.image.contentType);
        res.send(item.image.data);
    } catch (error) {
        console.error("❌ Error fetching image:", error);
        res.status(500).json({ message: "Error fetching image", error });
    }
});



module.exports = router;
