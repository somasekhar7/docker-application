const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 5005;
const InventoryItem = require("./inventoryModelItem");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const User = require("./user");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

// Allow all origins for demonstration purposes
app.use(cors());

// const uri =
//   "mongodb+srv://somasekhar23:Soma2356@myapp-staging.sbbfkgh.mongodb.net/?retryWrites=true&w=majority&appName=myapp-staging";

// const uri = 'mongodb://root:root@localhost:27017/'
const dbRun = async () => {
  const uri = process.env.MONGODB_URI;
  // const uri = "mongodb://root:root@localhost:27017"
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 200000,
  });
};

dbRun()
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log("Connection failed"));

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Connected to the database");
// });

app.use(express.json()); // Allows us to handle JSON data in the request body.

// Multer is a middleware that handles multipart/form-data, which is primarily used for uploading files.
// IMAGE UPLOAD SETTING
const storage = multer.diskStorage({
  destination: "localstorage/uploads/",
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "localstorage", "uploads"))
);

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login time
    user.lastLoginAt = new Date();
    await user.save();

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Signup route
app.post("/api/signup", async (req, res) => {
  console.log("route entered");
  const { firstName, lastName, dob, email, password } = req.body;

  try {
    // Check if user already exists
    // const existingUser = await User.findOne({ email });
    const existingUser = null;
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    console.log("before pwd hash");
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      dob,
      email,
      password: hashedPassword,
      createdAt: new Date(), // Set the created time
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile route
app.get("/api/profile/:email", async (req, res) => {
  const userEmail = req.params.email;

  try {
    // Find the user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user details excluding password field
    const userProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      email: user.email,
    };

    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
    const inventoryItems = await InventoryItem.find().maxTimeMS(10000);
    res.json(inventoryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
      const imagePath = path.join(
        __dirname,
        "localstorage",
        "uploads",
        deletedItem.itemImage
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the file if it exists
        console.log(`File ${deletedItem.itemImage} deleted successfully`);
      } else {
        console.warn(`File ${deletedItem.itemImage} doesn't exist`);
      }
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
