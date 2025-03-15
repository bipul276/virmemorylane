// middlewares/adminAuth.js
const jwt = require("jsonwebtoken");

function adminAuth(req, res, next) {
  const bearerHeader = req.header("Authorization");
  if (!bearerHeader) {
    return res.status(401).json({ message: "Access Denied" });
  }
  // Expect header format: "Bearer <token>"
  const parts = bearerHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Invalid Token Format" });
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
}

module.exports = adminAuth;
