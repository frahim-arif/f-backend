const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const controller = require("../controllers/visitor.controller");

const pingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests" },
});

router.post("/ping", pingLimiter, controller.ping);
router.get("/stats", controller.stats);

module.exports = router;