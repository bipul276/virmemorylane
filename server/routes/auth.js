// src/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { setOTP, verifyOTP } = require("../utils/otpStore");
const { sendOTPEmail } = require("../utils/mailer");

const router = express.Router();

// Utility function to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/* ==============================
      OTP GENERATION & VERIFICATION
============================== */

// Send OTP to Email
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = generateOTP();
  setOTP(email, otp);

  try {
    await sendOTPEmail(email, otp);
    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending email OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// Verify OTP before registration or password reset
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP required" });

  if (verifyOTP(email, otp)) {
    res.json({ message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid or expired OTP" });
  }
});

/* ==============================
      USER REGISTRATION (OTP)
============================== */
router.post("/register", async (req, res) => {
  const { username, email, password, otp } = req.body;

  // Verify OTP before allowing registration
  if (!verifyOTP(email, otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash the password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate JWT Token (include isAdmin; defaults to false)
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin || false },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ==============================
      LOGIN (Users + Admin)
============================== */
router.post("/login", async (req, res) => {
  console.log("Request body:", req.body);
  const { email, password } = req.body;
  console.log("Received login request for email:", email);

  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ message: "Email and password required" });
  }
  try {
    console.log("Using MONGO_URI:", process.env.MONGO_URI);
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      console.log("No user found with email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Password did not match for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token with admin flag
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Token generated:", token);

    res.json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
      VERIFY ADMIN STATUS
============================== */
router.get("/verify-admin", (req, res) => {
  const bearerHeader = req.header("Authorization");
  if (!bearerHeader) return res.status(401).json({ isAdmin: false });
  const parts = bearerHeader.split(" ");
  if (parts.length !== 2) return res.status(401).json({ isAdmin: false });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isAdmin: decoded.isAdmin });
  } catch (error) {
    res.status(400).json({ isAdmin: false });
  }
});

/* ==============================
      FORGOT PASSWORD (OTP)
============================== */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = generateOTP();
  setOTP(email, otp);

  try {
    await sendOTPEmail(email, otp);
    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending email OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (!verifyOTP(email, otp)) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
