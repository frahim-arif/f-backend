
const express = require("express");

const router = express.Router();

// ✅ Separate Bangla Controller
const questionController = require("../../controllers/admin/banglaQuestion.controller");

// =====================================================
// CREATE BANGLA QUESTION
// POST /api/bn/questions
// =====================================================

router.post(
  "/",
  questionController.createBanglaQuestion
);

// =====================================================
// GET ALL BANGLA QUESTIONS
// GET /api/bn/questions
// =====================================================

router.get(
  "/",
  questionController.getBanglaQuestions
);

// =====================================================
// GET BANGLA QUESTION BY SLUG
// GET /api/bn/questions/slug/:slug
// =====================================================

router.get(
  "/slug/:slug",
  questionController.getBanglaQuestionBySlug
);

// =====================================================
// UPDATE BANGLA QUESTION
// PUT /api/bn/questions/:id
// =====================================================

router.put(
  "/:id",
  questionController.updateBanglaQuestion
);

// =====================================================
// DELETE BANGLA QUESTION
// DELETE /api/bn/questions/:id
// =====================================================

router.delete(
  "/:id",
  questionController.deleteBanglaQuestion
);

module.exports = router;

