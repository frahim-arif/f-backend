const express = require("express");
const router = express.Router();

const {
  addQuestion,
  getQuestions,
  getQuestionBySlug,
  getQuestionsByCategory,
  // deleteQuestion,
} = require("../../controllers/website/question.controller.js");

// ✅ Add new question
router.post("/add", addQuestion);

// ✅ Get all questions
router.get("/", getQuestions);

// ✅ Get question by slug
router.get("/slug/:slug", getQuestionBySlug);

// ✅ Get questions by category
router.get("/category/:category", getQuestionsByCategory);

// // ✅ Delete question
// router.delete("/delete/:id", deleteQuestion);



module.exports = router;