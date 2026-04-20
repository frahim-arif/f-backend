const Question = require("../../models/question.model");
const fetch = require("node-fetch"); // ✅ required if Node < 18


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
    م: "m", ن: "n",
    و: "o",
    ہ: "h", ھ: "h",
    ء: "",
    ی: "i",
    ے: "e"
  };

  let slug = text
    .split("")
    .map(char => urduMap[char] || char)
    .join("");

  slug = slug
    .toLowerCase()

    // ❌ remove special chars
    .replace(/[^\w\s-]/g, "")

    // 🔥 normalize words (Banuri style - strong version)
.replace(/\b(my|mi|me)\b/g, "mein")
.replace(/\b(ky|k)\b/g, "ke")
.replace(/\b(awr|or|ur)\b/g, "aur")

// 🔥 common Islamic / Urdu corrections
.replace(/\b(swal|soal|sawal)\b/g, "sawal")
.replace(/\b(aqeqah|aqiqah|aqeeqah|aqiqh|qyqh)\b/g, "aqeeqah")
.replace(/\b(rwayat|riwayt|roaiat|rawayat)\b/g, "riwayat")
.replace(/\b(shmar|shumar|shumaar)\b/g, "shumar")
.replace(/\b(janor|janwar|janvar)\b/g, "janwar")

// 🔥 common words fix
.replace(/\b(mutaaliq|mutaliq|mutalliq)\b/g, "mutaliq")
.replace(/\b(shari|sharai|sharayi)\b/g, "shar-i")

    // 🔥 IMPORTANT: stopwords REMOVE nahi — keep "ke", "aur", "ka"
    // Banuri style me yeh rehte hain

    // 🔥 fix repeated letters
    .replace(/aa+/g, "a")
    .replace(/ii+/g, "i")
    .replace(/ee+/g, "e")
    .replace(/oo+/g, "o")

    // space → dash
    .replace(/\s+/g, "-")

    // remove extra dashes
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // 🔥 limit words (8-10 for SEO like Banuri)
  return slug
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
    const {
  question,
  answer,
  hawala1,
  hawala2,
  hawala3,
  category,
  metaTitle,
  metaDescription,
  keywords,
  slug: frontendSlug
} = req.body;

    // 🔥 1. Generate clean slug
let baseSlug = createSlug(metaTitle || question);
let slug = baseSlug;

const keywordArray = keywords
  ? keywords.split(",").map(k => k.trim())
  : [];

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
  metaTitle: metaTitle || question,
  metaDescription: metaDescription || answer?.slice(0, 150),
  keywords: keywordArray,
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