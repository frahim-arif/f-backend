const Question = require("../../models/question.model");
const fetch = require("node-fetch"); // ✅ required if Node < 18
const corrections = {
  // basic
  soal: "sawal",
  swal: "sawal",

  aqeqah: "aqeeqah",
  aqiqah: "aqeeqah",

  roaiat: "riwayat",
  rwayat: "riwayat",

  shmar: "shumar",

  janor: "janwar",

  // tumhare naye words
  chlne: "chalne",
  phrne: "phirne",
  sholt: "sahulat",
  lie: "liye",
  shrai: "shar-i",
  msjd: "masjid",
  qnot: "qunoot",
  jgh: "jagah",
  prh: "parh",
  da: "dua",
  lia: "liya",
  phr: "phir",
  iad: "yaad",jmah: "juma", nmaz: "namaz", sorh: "surah", ali: "aala", ghashih: "ghashiyah", prhna: "parhna",
  aia: "aaya",
  althiat: "tahiyyat",
  mi: "mein",
  chtai: "chatai", swal: "sawal", hsh: "hissa", w: "aur", s: "se", k: "ke",
  aor: "aur",
  qalin: "qaleen", zrort: "zarurat", zad: "ziyada", he: "hai", kia: "kiya", shkhs: "shakhs", anjmn: "anjuman", ia: "ya", akidmi: "academy", qam: "qaim", kya: "kya", as: "us",
  bioi: "biwi", bad: "baad", jmaat: "jamaat", phle: "pehle", wzw: "wuzu", awr: "aur", abart: "ibarat",
  lrai: "larai", chl: "chal", rhi: "rahi", ayk: "aik", shkhs: "shakhs", sna: "suna", he: "hai", kh: "ke", awrty: "aurat", jb: "jab", sal: "saal", gzrne: "guzarne",
};

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
    .replace(/[^\w\s-]/g, "");

  // ✅ dictionary apply
  Object.keys(corrections).forEach(word => {
    slug = slug.replace(
      new RegExp(`\\b${word}\\b`, "gi"),
      corrections[word]
    );
  });

  slug = slug
    .replace(/aa+/g, "a")
    .replace(/ii+/g, "i")
    .replace(/ee+/g, "e")
    .replace(/oo+/g, "o")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug
    .split("-")
    .filter(Boolean)
    .slice(0, 12)
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
exports.updateQuestion = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await Question.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // 🔥 OLD SLUG SAVE SYSTEM
    if (req.body.question) {
      let baseSlug = createSlug(req.body.question);
      let slug = baseSlug;

      let count = 1;
      while (await Question.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }

      // 👉 save old slug BEFORE changing
      if (existing.slug && existing.slug !== slug) {
        if (!existing.oldSlugs) {
          existing.oldSlugs = [];
        }

        existing.oldSlugs.push(existing.slug);
      }

      req.body.slug = slug;
    }

    // keywords conversion
    if (req.body.keywords) {
      req.body.keywords = req.body.keywords
        .split(",")
        .map((k) => k.trim());
    }

    Object.assign(existing, req.body);

    await existing.save();

    return res.json({
      success: true,
      message: "Question updated successfully",
      data: existing,
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