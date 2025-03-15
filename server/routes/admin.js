// routes/admin.js
const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const User = require("../models/User");
const Memory = require("../models/Memory");

// GET /api/admin/users - List all users (excluding passwords)
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/users/:id - Delete a user by id
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/memories - List all memories
router.get("/memories", adminAuth, async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    res.json(memories || []);
  } catch (error) {
    console.error("Error fetching memories:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/memories/:id - Delete a memory by id
router.delete("/memories/:id", adminAuth, async (req, res) => {
  try {
    const deletedMemory = await Memory.findByIdAndDelete(req.params.id);
    if (!deletedMemory) return res.status(404).json({ message: "Memory not found" });
    res.json({ message: "Memory deleted successfully" });
  } catch (error) {
    console.error("Error deleting memory:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
