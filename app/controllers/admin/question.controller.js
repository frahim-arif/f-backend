const Question = require("../../models/question.model");
const fetch = require("node-fetch"); // ✅ required if Node < 18

// ===========================
// 🔥 Slug Generator Function
function createSlug(text) {
  if (!text) return "no-slug";

  const urduMap = {
    ا: "a", آ: "a", ب: "b", پ: "p", ت: "t", ٹ: "t",
    ث: "s", ج: "j", چ: "ch", ح: "h", خ: "kh",
    د: "d", ڈ: "d", ذ: "z", ر: "r", ڑ: "r",
    ز: "z", ژ: "zh", س: "s", ش: "sh", ص: "s",
    ض: "z", ط: "t", ظ: "z", ع: "", غ: "gh",
    ف: "f", ق: "q", ک: "k", گ: "g", ل: "l",
    م: "m", ن: "n",
    و: "w",
    ہ: "h", ھ: "h",
    ء: "",
    ی: "y",
    ے: "e"
  };

  return text
    // 1️⃣ transliterate only
    .split("")
    .map(c => urduMap[c] ?? c)
    .join("")

    // 2️⃣ lowercase
    .toLowerCase()

    // 3️⃣ keep only safe chars
    .replace(/[^a-z0-9\s]/g, "")

    // 4️⃣ normalize spaces
    .replace(/\s+/g, " ")
    .trim()

    // 5️⃣ split words
    .split(" ")
    .filter(Boolean)

    // 6️⃣ limit words (Banuri-style short URL)
    .slice(0, 8)

    // 7️⃣ join with dash
    .join("-")

    // 8️⃣ final cleanup
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

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
// 📌 Get Questions by Category
// ===========================
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const questions = await Question.find({ category }).sort({
      createdAt: -1,
    });

    return res.json({ success: true, data: questions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ===========================
// 📌 Update Question
// ===========================
exports.updateQuestion = async (req, res) => {
  try {
    const id = req.params.id;

    // ✅ Agar question change hua to slug update karo
    if (req.body.question) {
      let baseSlug = createSlug(req.body.question);
      let slug = baseSlug;

      let count = 1;
      while (await Question.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }

      req.body.slug = slug;
    }

    // ✅ Keywords array me convert karo
    if (req.body.keywords) {
      req.body.keywords = req.body.keywords
        .split(",")
        .map((k) => k.trim());
    }

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