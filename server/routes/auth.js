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
  setOTP(email, otp); // Store OTP temporarily

  try {
    await sendOTPEmail(email, otp);
    return res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending email OTP:", error);
    return res.status(500).json({ message: "Error sending OTP" });
  }
});

// Verify OTP before registration or password reset
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  if (verifyOTP(email, otp)) {
    return res.json({ message: "OTP verified" });
  } else {
    return res.status(400).json({ message: "Invalid or expired OTP" });
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("🔹 Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ==============================
      LOGIN (Users + Admin)
   ============================== */

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    // Hardcoded Admin Login
    if (email === "bipulnandan276@gmail.com" && password === "9155602198") {
      const token = jwt.sign(
        { userId: "admin", username: "admin", isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({ token });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("🔹 Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
      FORGOT PASSWORD (OTP)
   ============================== */

// Request OTP for password reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = generateOTP();
  setOTP(email, otp);

  try {
    await sendOTPEmail(email, otp);
    return res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending email OTP:", error);
    return res.status(500).json({ message: "Error sending OTP" });
  }
});

// Reset password after OTP verification
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
