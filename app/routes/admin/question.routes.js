const express = require("express");
const router = express.Router();
const questionController = require("../../controllers/admin/question.controller");

// Admin Routes
router.post("/add-question", questionController.createQuestion);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

// Public Routes
router.get("/", questionController.getQuestions);
router.get("/slug/:slug", questionController.getQuestionBySlug);
router.get("/category/:category", questionController.getQuestionsByCategory);

module.exports = router;

// 📌 Get question by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const question = await Question.findOne({ slug: req.params.slug });
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
    res.json({ success: true, data: question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});