
const BanglaQuestion = require("../../models/banglaQuestion.model");

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
    await BanglaQuestion.findOne({
      banglaSlug: slug,
      ...(id ? { _id: { $ne: id } } : {}),
    })
  ) {
    slug = `${cleanBaseSlug}-${count}`;
    count++;
  }

  return slug;
}

// =====================================================
// CREATE BANGLA QUESTION
// POST /api/bn/questions
// =====================================================

exports.createBanglaQuestion = async (req, res) => {
  try {
    const {
      banglaQuestion,
      banglaAnswer,
      banglaHawala1,
      banglaHawala2,
      banglaHawala3,
      category,
      banglaSlug,
      banglaMetaTitle,
      banglaMetaDescription,
      banglaKeywords,
    } = req.body;

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!banglaQuestion?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bangla question is required",
      });
    }

    if (!banglaAnswer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bangla answer is required",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bangla category is required",
      });
    }

    // ---------------------------------------------
    // SLUG
    // ---------------------------------------------

    const baseSlug = createSimpleSlug(
      banglaSlug ||
        banglaMetaTitle ||
        banglaQuestion
    );

    const finalSlug = await makeUniqueSlug(baseSlug);

    // ---------------------------------------------
    // KEYWORDS
    // ---------------------------------------------

    const keywordArray = parseKeywords(
      banglaKeywords
    );

    // ---------------------------------------------
    // META DESCRIPTION
    // ---------------------------------------------

    const metaDescription =
      banglaMetaDescription?.trim() ||
      stripHtml(banglaAnswer).slice(0, 155);

    // ---------------------------------------------
    // CREATE
    // ---------------------------------------------

    const question = new BanglaQuestion({
      banglaQuestion: banglaQuestion.trim(),

      banglaAnswer: banglaAnswer.trim(),

      banglaHawala1:
        banglaHawala1?.trim() || "",

      banglaHawala2:
        banglaHawala2?.trim() || "",

      banglaHawala3:
        banglaHawala3?.trim() || "",

      banglaSlug: finalSlug,

      banglaMetaTitle:
        banglaMetaTitle?.trim() ||
        banglaQuestion.trim(),

      banglaMetaDescription:
        metaDescription,

      banglaKeywords:
        keywordArray,

      category: category.trim(),
    });

    await question.save();

    return res.status(201).json({
      success: true,
      message: "Bangla question added successfully",
      data: question,
    });
  } catch (error) {
    console.error(
      "❌ BANGLA CREATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL BANGLA QUESTIONS
// GET /api/bn/questions
// =====================================================

exports.getBanglaQuestions = async (req, res) => {
  try {
    const limit =
      parseInt(req.query.limit) || 10;

    const skip =
      parseInt(req.query.skip) || 0;

    const questions =
      await BanglaQuestion.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total =
      await BanglaQuestion.countDocuments();

    return res.json({
      success: true,
      data: questions,
      total,
      limit,
      skip,
    });
  } catch (error) {
    console.error(
      "❌ BANGLA GET ERROR:",
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
// GET BANGLA QUESTION BY SLUG
// GET /api/bn/questions/slug/:slug
// =====================================================

exports.getBanglaQuestionBySlug = async (
  req,
  res
) => {
  try {
    const { slug } = req.params;

    const question =
      await BanglaQuestion.findOne({
        $or: [
          { banglaSlug: slug },
          { oldBanglaSlugs: slug },
        ],
      });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Bangla question not found",
      });
    }

    return res.json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error(
      "❌ BANGLA SLUG ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE BANGLA QUESTION
// PUT /api/bn/questions/:id
// =====================================================

exports.updateBanglaQuestion = async (
  req,
  res
) => {
  try {
    const id = req.params.id;

    const existing =
      await BanglaQuestion.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Bangla question not found",
      });
    }

    // ---------------------------------------------
    // SLUG
    // ---------------------------------------------

    if (
      req.body.banglaQuestion ||
      req.body.banglaSlug ||
      req.body.banglaMetaTitle
    ) {
      const baseSlug =
        createSimpleSlug(
          req.body.banglaSlug ||
            req.body.banglaMetaTitle ||
            req.body.banglaQuestion ||
            existing.banglaQuestion
        );

      const newSlug =
        await makeUniqueSlug(
          baseSlug,
          id
        );

      // Save old slug
      if (
        existing.banglaSlug &&
        existing.banglaSlug !== newSlug
      ) {
        existing.oldBanglaSlugs =
          existing.oldBanglaSlugs || [];

        if (
          !existing.oldBanglaSlugs.includes(
            existing.banglaSlug
          )
        ) {
          existing.oldBanglaSlugs.push(
            existing.banglaSlug
          );
        }
      }

      req.body.banglaSlug = newSlug;
    }

    // ---------------------------------------------
    // KEYWORDS
    // ---------------------------------------------

    if (
      req.body.banglaKeywords !== undefined
    ) {
      req.body.banglaKeywords =
        parseKeywords(
          req.body.banglaKeywords
        );
    }

    // ---------------------------------------------
    // META DESCRIPTION
    // ---------------------------------------------

    if (
      !req.body.banglaMetaDescription &&
      req.body.banglaAnswer
    ) {
      req.body.banglaMetaDescription =
        stripHtml(
          req.body.banglaAnswer
        ).slice(0, 155);
    }

    // ---------------------------------------------
    // META TITLE
    // ---------------------------------------------

    if (
      !req.body.banglaMetaTitle &&
      req.body.banglaQuestion
    ) {
      req.body.banglaMetaTitle =
        req.body.banglaQuestion;
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
        "Bangla question updated successfully",
      data: existing,
    });
  } catch (error) {
    console.error(
      "❌ BANGLA UPDATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE BANGLA QUESTION
// DELETE /api/bn/questions/:id
// =====================================================

exports.deleteBanglaQuestion = async (
  req,
  res
) => {
  try {
    const id = req.params.id;

    const question =
      await BanglaQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Bangla question not found",
      });
    }

    await BanglaQuestion.findByIdAndDelete(id);

    return res.json({
      success: true,
      message:
        "Bangla question deleted successfully",
    });
  } catch (error) {
    console.error(
      "❌ BANGLA DELETE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

