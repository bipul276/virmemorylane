// routes/admin.js
const express = require("express");
const router = express.Router();
const { createMemory } = require("../controllers/adminController");

// POST /api/admin/memories - Create a new memory record
router.post("/memories", createMemory);

module.exports = router;
