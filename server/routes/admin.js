const express = require("express");
const router = express.Router();
const { createMemory } = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");

// POST /api/admin/memories - Create a new memory record
router.post("/memories", adminAuth, createMemory);

module.exports = router;
