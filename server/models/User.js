const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  favorites: [
    {
      location: { type: String, required: true },
      imageUrl: { type: String, required: true },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
