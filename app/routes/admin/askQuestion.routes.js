const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const controller = require("../controllers/admin/askQuestion.controller");

// NOTE: apni auth middleware file ka sahi naam/path likhein
const auth = require("../middleware/auth");

const askLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ghanta
  max: 5, // 5 sawal per IP per ghanta
  message: { success: false, message: "بہت زیادہ درخواستیں، بعد میں کوشش کریں" },
});

// PUBLIC
router.post("/", askLimiter, controller.createAskQuestion);

// ADMIN (token zaroori)
router.get("/", auth, controller.getAskQuestions);
router.patch("/:id/status", auth, controller.updateAskStatus);
router.delete("/:id", auth, controller.deleteAskQuestion);

module.exports = router;