
const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const controller = require("../../controllers/admin/askQuestion.controller");
const auth = require("../../middleware/auth");

const askLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "بہت زیادہ درخواستیں، بعد میں کوشش کریں",
  },
});

// PUBLIC: sawal bhejna
router.post("/", askLimiter, controller.createAskQuestion);

// PUBLIC: website par approved sawalat dikhana
router.get("/public", controller.getPublicAskQuestions);

// ADMIN: sawalat dekhna
router.get("/", auth, controller.getAskQuestions);

// ADMIN: public/private status
router.patch("/:id/public", auth, controller.updateAskPublic);

// ADMIN: jawab ka status badalna
router.patch("/:id/status", auth, controller.updateAskStatus);

// PUBLIC: website par approved sawalat dikhana
router.get("/public", controller.getPublicAskQuestions);

// ADMIN: sawalat dekhna
router.get("/", auth, controller.getAskQuestions);

// ADMIN: sawal delete karna
router.delete("/:id", auth, controller.deleteAskQuestion);

module.exports = router;
