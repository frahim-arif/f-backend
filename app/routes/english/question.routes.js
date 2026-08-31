
const express = require("express");

const router = express.Router();

// =====================================================
// ENGLISH QUESTION CONTROLLER
// =====================================================

const questionController = require(
  "../../controllers/admin/englishQuestion.controller"
);

// =====================================================
// CREATE ENGLISH QUESTION
// POST /api/en/questions
// =====================================================

router.post(
  "/",
  questionController.createEnglishQuestion
);

// =====================================================
// GET ALL ENGLISH QUESTIONS
// GET /api/en/questions
// =====================================================

router.get(
  "/",
  questionController.getEnglishQuestions
);

// =====================================================
// GET ENGLISH QUESTION BY SLUG
// GET /api/en/questions/slug/:slug
// =====================================================

router.get(
  "/slug/:slug",
  questionController.getEnglishQuestionBySlug
);

// =====================================================
// UPDATE ENGLISH QUESTION
// PUT /api/en/questions/:id
// =====================================================

router.put(
  "/:id",
  questionController.updateEnglishQuestion
);

// =====================================================
// DELETE ENGLISH QUESTION
// DELETE /api/en/questions/:id
// =====================================================

router.delete(
  "/:id",
  questionController.deleteEnglishQuestion
);

module.exports = router;

