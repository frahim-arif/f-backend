const express = require("express");
const router = express.Router();

const Category = require("../../models/category.model");
const Question = require("../../models/question.model");

// ✅ Add Category
router.post("/add-category", async (req, res) => {
  try {
    const { name, slug } = req.body;
    const cat = new Category({ name, slug });
    await cat.save();
    res.json({ success: true, message: "✅ Category Added", data: cat });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ✅ Add Question / Fatwa
router.post("/add-question", async (req, res) => {
  try {
    const { question, answer, category, hawala1, hawala2, hawala3 } = req.body;

    if (!question || !answer || !category) {
      return res.status(400).json({ success: false, message: "Question, Answer, and Category are required" });
    }

    const q = new Question({ question, answer, category, hawala1, hawala2, hawala3 });
    await q.save();

    res.json({ success: true, message: "✅ Fatwa Added Successfully", data: q });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Get All Questions
router.get("/questions", async (req, res) => {
  try {
    const list = await Question.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Get Questions by Category
router.get("/category/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const questions = await Question.find({ category: slug });
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = (server) => {
  server.use("/api/admin", router);
};
