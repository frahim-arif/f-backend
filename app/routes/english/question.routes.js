const express = require("express");

const router = express.Router();

const questionController = require("../../controllers/admin/question.controller");

// =====================================================
// CREATE ENGLISH QUESTION
// POST /api/admin/questions/english
// =====================================================

router.post(
  "/",
  questionController.createEnglishQuestion
);

// =====================================================
// GET ALL ENGLISH QUESTIONS
// GET /api/admin/questions/english
// =====================================================

router.get(
  "/",
  questionController.getEnglishQuestions
);

// =====================================================
// GET ENGLISH QUESTION BY SLUG
// GET /api/admin/questions/english/slug/:slug
// =====================================================

router.get(
  "/slug/:slug",
  questionController.getEnglishQuestionBySlug
);

// =====================================================
// UPDATE ENGLISH QUESTION
// PUT /api/admin/questions/english/:id
// =====================================================

router.put(
  "/:id",
  questionController.updateEnglishQuestion
);

// =====================================================
// DELETE ENGLISH QUESTION DATA
// DELETE /api/admin/questions/english/:id
// =====================================================

router.delete(
  "/:id",
  questionController.deleteEnglishQuestion
);

module.exports = router;