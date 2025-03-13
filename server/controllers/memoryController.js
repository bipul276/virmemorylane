const Memory = require('../models/Memory');

exports.getMemory = async (req, res) => {
  const { lat, lng, years } = req.query;

  try {
    let query = {};
    // Filter by years if it's not "all" and provided.
    if (years && years !== "all") {
      query.years = years;
    }
    // If coordinates are provided, filter by exact match.
    if (lat && lng) {
      query["location.lat"] = Number(lat);
      query["location.lng"] = Number(lng);
    }

    const memory = await Memory.findOne(query);
    if (!memory) return res.status(404).json({ message: "Memory not found" });
    res.json(memory);
  } catch (error) {
    console.error("Error fetching memory", error);
    res.status(500).json({ message: "Server error" });
  }
};
