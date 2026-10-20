const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const controller = require("../../controllers/admin/askQuestion.controller");

// NOTE: app/middleware/ me auth file ka asli naam yahan likhein
const auth = require("../../middleware/auth");

const askLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ghanta
  max: 5, // 5 sawal per IP per ghanta
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "بہت زیادہ درخواستیں، بعد میں کوشش کریں",
  },
});

// PUBLIC: user sawal bhejta hai
router.post("/", askLimiter, controller.createAskQuestion);

// ADMIN: token zaroori
router.get("/", auth, controller.getAskQuestions);
router.patch("/:id/status", auth, controller.updateAskStatus);
router.delete("/:id", auth, controller.deleteAskQuestion);

module.exports = router;