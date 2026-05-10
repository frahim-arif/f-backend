const express = require("express");
const router = express.Router();
const questionController = require("../../controllers/admin/question.controller");
const redirect301 = require("../../middleware/redirect301");

// Create
router.post("/", questionController.createQuestion);

// Get all
router.get("/", questionController.getQuestions);

// ✅ Get by slug (ADD THIS)
router.get(
  "/slug/:slug",
  redirect301,
  questionController.getQuestionBySlug
);

// Get by category
router.get("/category/:category", questionController.getQuestionsByCategory);

// Update
router.put("/:id", questionController.updateQuestion);

// Delete
router.delete("/:id", questionController.deleteQuestion);
module.exports = router;
