const Question = require("../../models/question.model");

// ===========================
// 📌 Create New Question
// ===========================
exports.createQuestion = async (req, res) => {
  try {
    const {
      question,
      answer,
      hawala1,
      hawala2,
      hawala3,
      category,
      slug,
      metaTitle,
      metaDescription,
      keywords,
    } = req.body;

    if (!question || !answer || !category) {
      return res.status(400).json({ success: false, message: "Question, answer, and category are required." });
    }

    // Slug check
    const existing = await Question.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Slug already exists. Use a different question." });
    }

    const newQuestion = await Question.create({
      question,
      answer,
      hawala1,
      hawala2,
      hawala3,
      category,
      slug,
      metaTitle,
      metaDescription,
      keywords,
    });

    return res.status(200).json({
      success: true,
      message: "Question added successfully",
      data: newQuestion,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// 📌 Get All Questions
// ===========================
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: questions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// 📌 Get Question by Slug (Public)
// ===========================
exports.getQuestionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const question = await Question.findOne({ slug });
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    return res.json({ success: true, data: question });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// 📌 Get Questions by Category
// ===========================
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const questions = await Question.find({ category }).sort({ createdAt: -1 });
    return res.json({ success: true, data: questions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// 📌 Update Question
// ===========================
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Question.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// 📌 Delete Question
// ===========================
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    return res.json({ success: true, message: "Question deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};