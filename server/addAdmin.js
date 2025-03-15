const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Failed", err));

// Admin Credentials
const adminData = {
  username: "admin",
  email: "bipulnandan276@gmail.com", // Change this
  password: "9155602198", // Change this
  isAdmin: true,
};

// Function to Add Admin User
const addAdmin = async () => {
  try {
    // Check if admin already exists
    let existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("⚠ Admin already exists.");
      mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    const newAdmin = new User({
      username: adminData.username,
      email: adminData.email,
      password: hashedPassword,
      isAdmin: true,
    });

    await newAdmin.save();
    console.log("✅ Admin user created successfully.");
  } catch (error) {
    console.error("❌ Error adding admin:", error);
  } finally {
    mongoose.connection.close(); // Close DB connection after operation
  }
};

// Run function
addAdmin();
