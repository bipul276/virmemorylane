const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios"); // For reCAPTCHA verification
const User = require("../models/User");
const router = express.Router();

// User Registration (with reCAPTCHA validation)
router.post("/register", async (req, res) => {
  const { username, email, password, recaptchaToken } = req.body;

  console.log("🔹 Received reCAPTCHA Token:", recaptchaToken); // Debugging

  if (!recaptchaToken) {
    return res.status(400).json({ message: "reCAPTCHA verification failed: No token provided" });
  }

  try {
    // Verify reCAPTCHA with Google
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    console.log("🔹 Google reCAPTCHA Response:", response.data); // Debugging

    if (!response.data.success) {
      return res.status(400).json({
        message: "reCAPTCHA verification failed",
        error: response.data,
      });
    }

    // Proceed with user registration
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Create token including username and email
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("🔹 reCAPTCHA Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// User Login (No reCAPTCHA required)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create token including username and email
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
