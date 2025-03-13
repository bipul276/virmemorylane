// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [
    {
      location: { type: String, required: true },
      imageUrl: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("User", UserSchema);
