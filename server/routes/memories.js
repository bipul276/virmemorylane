// routes/memories.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Memory = require("../models/Memory");
const auth = require("../middlewares/auth");

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ensure this folder exists in your server root
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST /api/memories - Create a new memory document
router.post("/", auth, upload.single("image"), async (req, res) => {
  const { lat, lng, dateTaken, transformationDetails, info } = req.body;
  if (!lat || !lng || !dateTaken || !req.file) {
    return res.status(400).json({ message: "Missing required fields: lat, lng, dateTaken, and image are required." });
  }
  try {
    // Replace backslashes with forward slashes (important on Windows)
    const fixedFilePath = req.file.path.replace(/\\/g, "/");

    const newMemory = new Memory({
      owner: req.user.userId,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      dateTaken: new Date(dateTaken),
      mostRelatedImage: fixedFilePath, // e.g., "uploads/image-123456789.jpg"
      transformationDetails: transformationDetails || "",
      info: info || ""
    });
    await newMemory.save();
    // Return the entire document (including _id)
    res.status(201).json(newMemory);
  } catch (error) {
    console.error("Error creating memory:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/memories/my - Fetch memories uploaded by the authenticated user
router.get("/my", auth, async (req, res) => {
  try {
    const memories = await Memory.find({ owner: req.user.userId }).sort({ createdAt: -1 });
    if (!memories || memories.length === 0) {
      return res.status(404).json({ message: "No memories found" });
    }
    res.json(memories);
  } catch (error) {
    console.error("Error fetching user's memories:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/memories?lat=...&lng=...&years=... - Fetch all memories matching query parameters
router.get("/", async (req, res) => {
  const { lat, lng, years } = req.query;
  try {
    let query = {};
    if (years && years !== "all") {
      query.years = years;
    }
    if (lat && lng) {
      const tolerance = 0.01; // adjust as needed
      query["location.lat"] = { $gte: Number(lat) - tolerance, $lte: Number(lat) + tolerance };
      query["location.lng"] = { $gte: Number(lng) - tolerance, $lte: Number(lng) + tolerance };
    }
    const memories = await Memory.find(query).sort({ createdAt: -1 });
    if (!memories || memories.length === 0) {
      return res.status(404).json({ message: "No memories found" });
    }
    res.json(memories);
  } catch (error) {
    console.error("Error fetching memories:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/memories/:id - Fetch a memory by its _id (for details page)
// Make sure this route is defined AFTER the /my route.
router.get("/:id", async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: "Memory not found" });
    res.json(memory);
  } catch (error) {
    console.error("Error fetching memory:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
