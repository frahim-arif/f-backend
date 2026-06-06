const express = require("express");
const router = express.Router();
const authController = require("../../controllers/admin/auth.controller");

// Register - use once via curl or protect via other means
router.post("/register", authController.registerAdmin);

// Login
router.post("/login", authController.loginAdmin);

module.exports = router;
