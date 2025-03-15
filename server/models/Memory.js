// models/Memory.js
const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  dateTaken: { type: Date, required: true },
  mostRelatedImage: { type: String, required: true },
  transformationDetails: { type: String, required: true },
  info: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Memory', MemorySchema);
