const express = require("express");
const router = express.Router();
const { getMemory } = require('../controllers/memoryController');

router.get('/', getMemory);

module.exports = router;
