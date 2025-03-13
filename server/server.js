// server.js
const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const memoryRoutes = require("./routes/memories");
const authRoutes   = require("./routes/auth");
const adminRoutes  = require("./routes/admin");
const favoritesRoutes = require("./routes/favorites");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoritesRoutes);

app.get("/", (req, res) => {
  res.send("Virtual Memory Lane API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
