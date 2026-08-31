const express = require("express");

const router = express.Router();

const questionController = require("../../controllers/admin/question.controller");

// =====================================================
// CREATE BANGLA QUESTION
// POST /api/admin/questions/bangla
// =====================================================

router.post(
  "/",
  questionController.createBanglaQuestion
);

// =====================================================
// GET ALL BANGLA QUESTIONS
// GET /api/admin/questions/bangla
// =====================================================

router.get(
  "/",
  questionController.getBanglaQuestions
);

// =====================================================
// GET BANGLA QUESTION BY SLUG
// GET /api/admin/questions/bangla/slug/:slug
// =====================================================

router.get(
  "/slug/:slug",
  questionController.getBanglaQuestionBySlug
);

// =====================================================
// UPDATE BANGLA QUESTION
// PUT /api/admin/questions/bangla/:id
// =====================================================

router.put(
  "/:id",
  questionController.updateBanglaQuestion
);

// =====================================================
// DELETE BANGLA QUESTION DATA
// DELETE /api/admin/questions/bangla/:id
// =====================================================

router.delete(
  "/:id",
  questionController.deleteBanglaQuestion
);

module.exports = router;