require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const admin = require("firebase-admin");
const fs = require("fs");
const connectDB = require("./config/db");

// Initialize Firebase Admin SDK

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "virmemorylane.firebasestorage.app",
});

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Register routes
const memoriesRoutes = require("./routes/memories");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const favoritesRoutes = require("./routes/favorites");

app.use("/api/memories", memoriesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);

// Optionally serve static files (e.g., uploaded files, if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root endpoint
app.get("/", (req, res) => {
  res.send("Virtual Memory Lane API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
