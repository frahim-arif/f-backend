
const EnglishQuestion = require("../../models/englishQuestion.model");

// =====================================================
// CREATE ENGLISH QUESTION
// =====================================================

exports.createEnglishQuestion = async (req, res) => {
  try {
    const {
      englishQuestion,
      englishAnswer,
      englishHawala1,
      englishHawala2,
      englishHawala3,
      englishSlug,
      englishMetaTitle,
      englishMetaDescription,
      englishKeywords,
      category,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!englishQuestion?.trim()) {
      return res.status(400).json({
        success: false,
        message: "English question is required",
      });
    }

    if (!englishAnswer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "English answer is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "English category is required",
      });
    }

    // =========================
    // GENERATE SLUG
    // =========================

    let slug =
      englishSlug?.trim() ||
      englishQuestion
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    let finalSlug = slug;
    let count = 1;

    while (
      await EnglishQuestion.findOne({
        slug: finalSlug,
      })
    ) {
      finalSlug = `${slug}-${count}`;
      count++;
    }

    // =========================
    // KEYWORDS
    // =========================

    const keywordArray = Array.isArray(englishKeywords)
      ? englishKeywords
      : (englishKeywords || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    // =========================
    // CREATE
    // =========================

    const question = await EnglishQuestion.create({
      question: englishQuestion.trim(),

      answer: englishAnswer.trim(),

      hawala1: englishHawala1?.trim() || "",
      hawala2: englishHawala2?.trim() || "",
      hawala3: englishHawala3?.trim() || "",

      category,

      slug: finalSlug,

      metaTitle:
        englishMetaTitle?.trim() ||
        englishQuestion.trim(),

      metaDescription:
        englishMetaDescription?.trim() ||
        englishAnswer
          .replace(/<[^>]*>/g, "")
          .slice(0, 155),

      keywords: keywordArray,
    });

    return res.status(201).json({
      success: true,
      message: "English question added successfully",
      data: question,
    });
  } catch (error) {
    console.error("❌ ENGLISH CREATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL ENGLISH QUESTIONS
// =====================================================

exports.getEnglishQuestions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const questions = await EnglishQuestion.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("category");

    return res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("❌ ENGLISH GET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ENGLISH QUESTION BY SLUG
// =====================================================

exports.getEnglishQuestionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const question = await EnglishQuestion.findOne({
      $or: [
        { slug: slug },
        { oldSlugs: slug },
      ],
    }).populate("category");

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "English question not found",
      });
    }

    return res.json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("❌ ENGLISH SLUG ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE ENGLISH QUESTION
// =====================================================

exports.updateEnglishQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const existing =
      await EnglishQuestion.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "English question not found",
      });
    }

    const {
      englishQuestion,
      englishAnswer,
      englishHawala1,
      englishHawala2,
      englishHawala3,
      englishSlug,
      englishMetaTitle,
      englishMetaDescription,
      englishKeywords,
      category,
    } = req.body;

    // =========================
    // CONTENT
    // =========================

    if (englishQuestion !== undefined) {
      if (!englishQuestion.trim()) {
        return res.status(400).json({
          success: false,
          message: "English question is required",
        });
      }

      existing.question =
        englishQuestion.trim();
    }

    if (englishAnswer !== undefined) {
      if (!englishAnswer.trim()) {
        return res.status(400).json({
          success: false,
          message: "English answer is required",
        });
      }

      existing.answer = englishAnswer.trim();
    }

    if (englishHawala1 !== undefined) {
      existing.hawala1 = englishHawala1;
    }

    if (englishHawala2 !== undefined) {
      existing.hawala2 = englishHawala2;
    }

    if (englishHawala3 !== undefined) {
      existing.hawala3 = englishHawala3;
    }

    // =========================
    // CATEGORY
    // =========================

    if (category !== undefined) {
      existing.category = category;
    }

    // =========================
    // SEO
    // =========================

    if (englishMetaTitle !== undefined) {
      existing.metaTitle =
        englishMetaTitle.trim();
    }

    if (
      englishMetaDescription !== undefined
    ) {
      existing.metaDescription =
        englishMetaDescription.trim();
    }

    // =========================
    // KEYWORDS
    // =========================

    if (englishKeywords !== undefined) {
      existing.keywords =
        Array.isArray(englishKeywords)
          ? englishKeywords
          : englishKeywords
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);
    }

    // =========================
    // SLUG
    // =========================

    if (
      englishSlug !== undefined &&
      englishSlug.trim()
    ) {
      const slug = englishSlug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      let finalSlug = slug;
      let count = 1;

      while (
        await EnglishQuestion.findOne({
          slug: finalSlug,
          _id: { $ne: id },
        })
      ) {
        finalSlug = `${slug}-${count}`;
        count++;
      }

      // Old slug save
      if (
        existing.slug &&
        existing.slug !== finalSlug
      ) {
        if (
          !existing.oldSlugs.includes(
            existing.slug
          )
        ) {
          existing.oldSlugs.push(
            existing.slug
          );
        }
      }

      existing.slug = finalSlug;
    }

    await existing.save();

    return res.json({
      success: true,
      message:
        "English question updated successfully",
      data: existing,
    });
  } catch (error) {
    console.error(
      "❌ ENGLISH UPDATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE ENGLISH QUESTION
// =====================================================

exports.deleteEnglishQuestion = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const question =
      await EnglishQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "English question not found",
      });
    }

    await EnglishQuestion.findByIdAndDelete(id);

    return res.json({
      success: true,
      message:
        "English question deleted successfully",
    });
  } catch (error) {
    console.error(
      "❌ ENGLISH DELETE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

