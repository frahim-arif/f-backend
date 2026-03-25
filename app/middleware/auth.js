const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) return res.status(401).json({ success: false, message: "Unauthorized" });

    req.admin = admin;
    next();
  } catch (err) {
    console.log("auth err", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
