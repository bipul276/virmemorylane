/* // controllers/adminController.js
const Memory = require("../models/Memory");

const createMemory = async (req, res) => {
  const { lat, lng, years, mostRelatedImage, transformationDetails, info } = req.body;
  if (!lat || !lng || !years || !mostRelatedImage) {
    return res.status(400).json({ message: "Required fields missing" });
  }
  try {
    const newMemory = new Memory({
      location: { lat, lng },
      years,
      mostRelatedImage,
      transformationDetails,
      info,
    });
    await newMemory.save();
    res.status(201).json(newMemory);
  } catch (error) {
    console.error("Error creating memory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = createMemory;
 */
