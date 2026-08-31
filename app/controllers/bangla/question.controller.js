
const BanglaQuestion = require("../../models/banglaQuestion.model");

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function stripHtml(text = "") {
  return text
    .toString()
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

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
// SLUG
// =====================================================

function createSlug(text) {
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
// UNIQUE SLUG
// =====================================================

async function makeUniqueSlug(baseSlug, id = null) {
  const cleanBaseSlug = baseSlug || "no-slug";

  let slug = cleanBaseSlug;
  let count = 1;

  while (
    await BanglaQuestion.findOne({
      slug,
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
// =====================================================

exports.createBanglaQuestion = async (
  req,
  res
) => {
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
      slug,
    } = req.body;

    // Validation
    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bangla question is required",
      });
    }

    if (!answer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bangla answer is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // Slug
    const baseSlug = createSlug(
      slug || metaTitle || question
    );

    const finalSlug =
      await makeUniqueSlug(baseSlug);

    // Keywords
    const keywordArray =
      parseKeywords(keywords);

    // Meta description
    const finalMetaDescription =
      metaDescription?.trim() ||
      stripHtml(answer).slice(0, 155);

    // Create
    const banglaQuestion =
      new BanglaQuestion({
        question: question.trim(),

        answer,

        hawala1: hawala1 || "",
        hawala2: hawala2 || "",
        hawala3: hawala3 || "",

        category,

        slug: finalSlug,

        metaTitle:
          metaTitle?.trim() ||
          question.trim(),

        metaDescription:
          finalMetaDescription,

        keywords:
          keywordArray,
      });

    await banglaQuestion.save();

    return res.status(201).json({
      success: true,
      message:
        "Bangla question added successfully",
      data: banglaQuestion,
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
// =====================================================

exports.getBanglaQuestions = async (
  req,
  res
) => {
  try {
    const limit =
      parseInt(req.query.limit) || 10;

    const skip =
      parseInt(req.query.skip) || 0;

    const questions =
      await BanglaQuestion.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category");

    const total =
      await BanglaQuestion.countDocuments();

    return res.json({
      success: true,
      data: questions,
      total,
    });
  } catch (error) {
    console.error(
      "❌ BANGLA GET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET BANGLA QUESTION BY SLUG
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
          { slug },
          { oldSlugs: slug },
        ],
      }).populate("category");

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Bangla question not found",
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
        message:
          "Bangla question not found",
      });
    }

    // ---------------------------------------------
    // SLUG
    // ---------------------------------------------

    if (
      req.body.question ||
      req.body.slug ||
      req.body.metaTitle
    ) {
      const baseSlug =
        createSlug(
          req.body.slug ||
          req.body.metaTitle ||
          req.body.question ||
          existing.question
        );

      const newSlug =
        await makeUniqueSlug(
          baseSlug,
          id
        );

      if (
        existing.slug &&
        existing.slug !== newSlug
      ) {
        existing.oldSlugs =
          existing.oldSlugs || [];

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

      req.body.slug = newSlug;
    }

    // ---------------------------------------------
    // KEYWORDS
    // ---------------------------------------------

    if (
      req.body.keywords !== undefined
    ) {
      req.body.keywords =
        parseKeywords(
          req.body.keywords
        );
    }

    // ---------------------------------------------
    // META DESCRIPTION
    // ---------------------------------------------

    if (
      !req.body.metaDescription &&
      req.body.answer
    ) {
      req.body.metaDescription =
        stripHtml(
          req.body.answer
        ).slice(0, 155);
    }

    // ---------------------------------------------
    // META TITLE
    // ---------------------------------------------

    if (
      !req.body.metaTitle &&
      req.body.question
    ) {
      req.body.metaTitle =
        req.body.question;
    }

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
