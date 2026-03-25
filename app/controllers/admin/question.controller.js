const Question = require("../../models/question.model");

// ===========================
// 📌 Create New Question
// ===========================
exports.createQuestion = async (req, res) => {
  try {
    const { question, answer, hawala1, hawala2, hawala3, category } = req.body;

    const newQuestion = await Question.create({
      question,
      answer,
      hawala1,
      hawala2,
      hawala3,
      category,
    });

    return res.json({
      success: true,
      message: "Question added successfully",
      data: newQuestion,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// 📌 Get All Questions with Pagination
// ===========================
exports.getQuestions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({ success: true, data: questions });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// 📌 Get Questions by Category with Pagination
// ===========================
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    const questions = await Question.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({ success: true, data: questions });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// 📌 Update Question
// ===========================
exports.updateQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const updated = await Question.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.json({
      success: true,
      message: "Question updated successfully",
      data: updated,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===========================
// 📌 Delete Question
// ===========================
exports.deleteQuestion = async (req, res) => {
  try {
    const id = req.params.id;

    await Question.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
