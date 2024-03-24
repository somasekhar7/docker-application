const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const InventoryItem = require("./inventoryModelItem");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Allow all origins for demonstration purposes
app.use(cors());

const PORT = process.env.PORT || 5005;

const uri =
  "mongodb+srv://somasekhar23:Soma2356@myapp-staging.sbbfkgh.mongodb.net/?retryWrites=true&w=majority&appName=myapp-staging";

mongoose.connect(uri);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to the database");
});

app.use(express.json()); // Allows us to handle JSON data in the request body.

// Multer is a middleware that handles multipart/form-data, which is primarily used for uploading files.
// IMAGE UPLOAD SETTING
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// for addition function
app.post("/api/addition", (req, res) => {
  const { num1, num2 } = req.body;
  const result = num1 + num2;
  res.json({ result });
});

// Get all inventory items
app.get("/inventory", async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find();
    res.json(inventoryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Add an inventory item
app.post(
  "/inventory/add-item",
  upload.single("itemImage"),
  async (req, res) => {
    const newItem = new InventoryItem({
      itemName: req.body.itemName,
      itemQuantity: req.body.itemQuantity,
      itemImage: req.file ? req.file.filename : null,
    });

    try {
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update an inventory item
app.put(
  "/inventory/update-item/:id",
  upload.single("itemImage"),
  async (req, res) => {
    try {
      let updatedItem = {
        itemName: req.body.itemName,
        itemQuantity: req.body.itemQuantity,
      };

      if (req.file) {
        updatedItem.itemImage = req.file.filename;
      }

      const updatedItemResponse = await InventoryItem.findByIdAndUpdate(
        req.params.id,
        updatedItem,
        { new: true }
      );
      res.json(updatedItemResponse);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete an inventory item
app.delete("/inventory/delete-item/:id", async (req, res) => {
  try {
    const deletedItem = await InventoryItem.findByIdAndDelete(req.params.id);
    if (deletedItem.itemImage) {
      fs.unlinkSync(
        path.join(__dirname, "public", "uploads", deletedItem.itemImage)
      );
    }
    res.json({ message: "Deleted item" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: err.message });
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
