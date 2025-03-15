// server.js
const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");

// Import routes
const authRoutes   = require("./routes/auth");
const memoriesRoutes = require("./routes/memories");
const adminRoutes  = require("./routes/admin");
const favoritesRoutes = require("./routes/favorites");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the uploads folder
app.use('/uploads', express.static("uploads"));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/memories", memoriesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoritesRoutes);

app.get("/", (req, res) => {
  res.send("Virtual Memory Lane API");
});

// Admin verification endpoint (using Bearer token for consistency)
app.get("/api/auth/verify-admin", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ isAdmin: false });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isAdmin: decoded.isAdmin });
  } catch (error) {
    res.status(400).json({ isAdmin: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
