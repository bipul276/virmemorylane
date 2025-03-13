// routes/favorites.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// GET /api/favorites - fetch logged-in user's favorites
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/favorites - add a favorite memory
router.post("/", auth, async (req, res) => {
  const { location, imageUrl } = req.body;
  if (!location || !imageUrl) {
    return res.status(400).json({ message: "Missing location or imageUrl" });
  }
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.favorites.push({ location, imageUrl });
    await user.save();
    res.status(201).json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
