
const EnglishQuestion = require("../../models/englishQuestion.model");

// =====================================================
// HELPER: REMOVE HTML
// =====================================================

function stripHtml(text = "") {
  return text
    .toString()
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// =====================================================
// HELPER: KEYWORDS
// =====================================================

function parseKeywords(keywords) {
  if (!keywords) return [];

  if (Array.isArray(keywords)) {
    return keywords
      .map((keyword) => keyword.toString().trim())
      .filter(Boolean);
  }

  return keywords
    .toString()
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

// =====================================================
// HELPER: SLUG
// =====================================================

function createSimpleSlug(text) {
  if (!text) return "no-slug";

  const slug = text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .split("-")
    .filter(Boolean)
    .slice(0, 12)
    .join("-");

  return slug || "no-slug";
}

// =====================================================
// HELPER: UNIQUE SLUG
// =====================================================

async function makeUniqueSlug(baseSlug, id = null) {
  const cleanBaseSlug = baseSlug || "no-slug";

  let slug = cleanBaseSlug;
  let count = 1;

  while (
    await EnglishQuestion.findOne({
      englishSlug: slug,
      ...(id ? { _id: { $ne: id } } : {}),
    })
  ) {
    slug = `${cleanBaseSlug}-${count}`;
    count++;
  }

  return slug;
}

// =====================================================
// CREATE ENGLISH QUESTION
// POST /api/en/questions
// =====================================================

exports.createEnglishQuestion = async (req, res) => {
  try {
    const {
      englishQuestion,
      englishAnswer,
      englishHawala1,
      englishHawala2,
      englishHawala3,
      category,
      englishSlug,
      englishMetaTitle,
      englishMetaDescription,
      englishKeywords,
    } = req.body;

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

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

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "English category is required",
      });
    }

    // ---------------------------------------------
    // SLUG
    // ---------------------------------------------

    const baseSlug = createSimpleSlug(
      englishSlug ||
        englishMetaTitle ||
        englishQuestion
    );

    const finalSlug = await makeUniqueSlug(baseSlug);

    // ---------------------------------------------
    // KEYWORDS
    // ---------------------------------------------

    const keywordArray = parseKeywords(
      englishKeywords
    );

    // ---------------------------------------------
    // META DESCRIPTION
    // ---------------------------------------------

    const metaDescription =
      englishMetaDescription?.trim() ||
      stripHtml(englishAnswer).slice(0, 155);

    // ---------------------------------------------
    // CREATE
    // ---------------------------------------------

    const question = new EnglishQuestion({
      englishQuestion: englishQuestion.trim(),

      englishAnswer: englishAnswer.trim(),

      englishHawala1:
        englishHawala1?.trim() || "",

      englishHawala2:
        englishHawala2?.trim() || "",

      englishHawala3:
        englishHawala3?.trim() || "",

      englishSlug: finalSlug,

      englishMetaTitle:
        englishMetaTitle?.trim() ||
        englishQuestion.trim(),

      englishMetaDescription:
        metaDescription,

      englishKeywords: keywordArray,

      category: category.trim(),
    });

    await question.save();

    return res.status(201).json({
      success: true,
      message: "English question added successfully",
      data: question,
    });
  } catch (error) {
    console.error(
      "❌ ENGLISH CREATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL ENGLISH QUESTIONS
// GET /api/en/questions
// =====================================================

exports.getEnglishQuestions = async (req, res) => {
  try {
    const limit =
      parseInt(req.query.limit) || 10;

    const skip =
      parseInt(req.query.skip) || 0;

    const questions = await EnglishQuestion.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total =
      await EnglishQuestion.countDocuments();

    return res.json({
      success: true,
      data: questions,
      total,
      limit,
      skip,
    });
  } catch (error) {
    console.error(
      "❌ ENGLISH GET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      data: [],
      message: error.message,
    });
  }
};

// =====================================================
// GET ENGLISH QUESTION BY SLUG
// GET /api/en/questions/slug/:slug
// =====================================================

exports.getEnglishQuestionBySlug = async (
  req,
  res
) => {
  try {
    const { slug } = req.params;

    const question =
      await EnglishQuestion.findOne({
        $or: [
          { englishSlug: slug },
          { oldEnglishSlugs: slug },
        ],
      });

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
    console.error(
      "❌ ENGLISH SLUG ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE ENGLISH QUESTION
// PUT /api/en/questions/:id
// =====================================================

exports.updateEnglishQuestion = async (
  req,
  res
) => {
  try {
    const id = req.params.id;

    const existing =
      await EnglishQuestion.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "English question not found",
      });
    }

    // ---------------------------------------------
    // SLUG
    // ---------------------------------------------

    if (
      req.body.englishQuestion ||
      req.body.englishSlug ||
      req.body.englishMetaTitle
    ) {
      const baseSlug = createSimpleSlug(
        req.body.englishSlug ||
          req.body.englishMetaTitle ||
          req.body.englishQuestion ||
          existing.englishQuestion
      );

      const newSlug =
        await makeUniqueSlug(
          baseSlug,
          id
        );

      // Save old slug
      if (
        existing.englishSlug &&
        existing.englishSlug !== newSlug
      ) {
        existing.oldEnglishSlugs =
          existing.oldEnglishSlugs || [];

        if (
          !existing.oldEnglishSlugs.includes(
            existing.englishSlug
          )
        ) {
          existing.oldEnglishSlugs.push(
            existing.englishSlug
          );
        }
      }

      req.body.englishSlug = newSlug;
    }

    // ---------------------------------------------
    // KEYWORDS
    // ---------------------------------------------

    if (
      req.body.englishKeywords !== undefined
    ) {
      req.body.englishKeywords =
        parseKeywords(
          req.body.englishKeywords
        );
    }

    // ---------------------------------------------
    // META DESCRIPTION
    // ---------------------------------------------

    if (
      !req.body.englishMetaDescription &&
      req.body.englishAnswer
    ) {
      req.body.englishMetaDescription =
        stripHtml(
          req.body.englishAnswer
        ).slice(0, 155);
    }

    // ---------------------------------------------
    // META TITLE
    // ---------------------------------------------

    if (
      !req.body.englishMetaTitle &&
      req.body.englishQuestion
    ) {
      req.body.englishMetaTitle =
        req.body.englishQuestion;
    }

    // ---------------------------------------------
    // UPDATE
    // ---------------------------------------------

    Object.assign(
      existing,
      req.body
    );

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
// DELETE /api/en/questions/:id
// =====================================================

exports.deleteEnglishQuestion = async (
  req,
  res
) => {
  try {
    const id = req.params.id;

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

