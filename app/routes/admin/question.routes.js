const express = require("express");
const router = express.Router();
const questionController = require("../../controllers/admin/question.controller");

// Create
router.post("/", questionController.createQuestion);

// Get all
router.get("/", questionController.getQuestions);

// ✅ Get by slug (ADD THIS)
router.get("/slug/:slug", questionController.getQuestionBySlug);

// Get by category
router.get("/category/:category", questionController.getQuestionsByCategory);

// Update
router.put("/:id", questionController.updateQuestion);

// Delete
router.delete("/:id", questionController.deleteQuestion);

module.exports = router;