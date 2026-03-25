const Admin = require("../../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret"; // set in prod
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

// Register admin (only use once or protect it)
exports.registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: "Missing fields" });

    const exists = await Admin.findOne({ username });
    if (exists)
      return res.status(400).json({ success: false, message: "Admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ username, password: hashed });
    return res.json({ success: true, message: "Admin created", data: { id: admin._id, username: admin.username } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const payload = { id: admin._id, username: admin.username, role: admin.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return res.json({ success: true, token, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
