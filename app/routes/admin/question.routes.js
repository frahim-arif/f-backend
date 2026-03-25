const express = require("express");
const router = express.Router();
const questionController = require("../../controllers/admin/question.controller");

// ===========================
// 📌 Create New Question
// ===========================
router.post("/", questionController.createQuestion);

// ===========================
// 📌 Get All Questions
// ===========================
router.get("/", questionController.getQuestions);

// ===========================
// 📌 Get Questions by Category
// ===========================
router.get("/category/:category", questionController.getQuestionsByCategory);

// ===========================
// 📌 Update Question
// ===========================
router.put("/:id", questionController.updateQuestion);

// ===========================
// 📌 Delete Question
// ===========================
router.delete("/:id", questionController.deleteQuestion);

module.exports = router;
