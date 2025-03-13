// models/Memory.js
const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  years: { type: String, required: true },
  mostRelatedImage: { type: String, required: true },
  transformationDetails: { type: String, required: true },
  info: { type: String, required: true }
});

module.exports = mongoose.model('Memory', MemorySchema);
