const Question = require("../../models/question.model");
const fetch = require("node-fetch"); // ✅ required if Node < 18

// ===========================
// 🔥 Slug Generator Function
// ===========================
function createSlug(text) {
  if (!text) return "no-slug";

  const urduMap = {
    ا: "a", آ: "aa", ب: "b", پ: "p", ت: "t", ٹ: "t",
    ث: "s", ج: "j", چ: "ch", ح: "h", خ: "kh",
    د: "d", ڈ: "d", ذ: "z", ر: "r", ڑ: "r",
    ز: "z", ژ: "zh", س: "s", ش: "sh", ص: "s",
    ض: "z", ط: "t", ظ: "z", ع: "a", غ: "gh",
    ف: "f", ق: "q", ک: "k", گ: "g", ل: "l",
    م: "m", ن: "n", و: "w", ہ: "h", ھ: "h",
    ء: "", ی: "y", ے: "e"
  };

  let slug = text
    .split("")
    .map(char => urduMap[char] || char) // convert Urdu → English
    .join("");

  return slug
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-")
    .split("-")
    .filter(Boolean)
    .slice(0, 10)
    .join("-");
}

// ===========================
// 📌 Create New Question
// ===========================
exports.createQuestion = async (req, res) => {
  try {
    const { question, answer, hawala1, hawala2, hawala3, category } = req.body;

    // 🔥 1. Generate clean slug
let baseSlug = createSlug(question);
let slug = baseSlug;

// 🔥 2. Ensure unique slug
let count = 1;
while (await Question.findOne({ slug })) {
  slug = `${baseSlug}-${count}`;
  count++;
}

    // 🔥 3. Create question
    const newQuestion = new Question({
      question,
      slug,
      answer,
      hawala1,
      hawala2,
      hawala3,
      category,
    });

    await newQuestion.save();

    // 🔥 4. Google Sitemap Ping
    try {
      await fetch(
        "https://www.google.com/ping?sitemap=https://www.maslakedeoband.in/sitemap.xml"
      );
      console.log("✅ Google ping sent");
    } catch (err) {
      console.log("⚠️ Ping failed (ignore):", err.message);
    }

    return res.json({
      success: true,
      message: "Question added successfully",
      data: newQuestion,
    });
  } catch (err) {
    console.error("❌ ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===========================
// 📌 Get All Questions
// ===========================
exports.getQuestions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({ success: true, data: questions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ===========================
// 📌 Get Questions by Category (with pagination)
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    const questions = await Question.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      data: questions,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===========================
// 📌 Update Question
// ===========================
exports.updateQuestion = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json({
      success: true,
      message: "Question updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
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
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ===========================
// 📌 Get Question by Slug
// ===========================
exports.getQuestionBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;

    const question = await Question.findOne({ slug });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.json({
      success: true,
      data: question,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};