const BanglaQuestion = require("../../models/banglaQuestion.model");

// =====================================================
// STRIP HTML
// =====================================================

function stripHtml(text = "") {
  return text
    .toString()
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

// =====================================================
// PARSE KEYWORDS
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
// BANGLA → ROMAN
// =====================================================

function banglaToRoman(text = "") {
  const map = {
    // Vowels
    "অ": "o",
    "আ": "a",
    "ই": "i",
    "ঈ": "i",
    "উ": "u",
    "ঊ": "u",
    "ঋ": "ri",
    "এ": "e",
    "ঐ": "oi",
    "ও": "o",
    "ঔ": "ou",

    // Ka group
    "ক": "k",
    "খ": "kh",
    "গ": "g",
    "ঘ": "gh",
    "ঙ": "ng",

    // Cha group
    "চ": "ch",
    "ছ": "chh",
    "জ": "j",
    "ঝ": "jh",
    "ঞ": "n",

    // Ta group
    "ট": "t",
    "ঠ": "th",
    "ড": "d",
    "ঢ": "dh",
    "ণ": "n",

    // Ta group
    "ত": "t",
    "থ": "th",
    "দ": "d",
    "ধ": "dh",
    "ন": "n",

    // Pa group
    "প": "p",
    "ফ": "ph",
    "ব": "b",
    "ভ": "bh",
    "ম": "m",

    // Others
    "য": "j",
    "র": "r",
    "ল": "l",

    "শ": "sh",
    "ষ": "sh",
    "স": "s",
    "হ": "h",

    "ড়": "r",
    "ঢ়": "rh",
    "য়": "y",

    // Signs
    "ৎ": "t",
    "ং": "ng",
    "ঃ": "h",
    "ঁ": "n",

    // Hasanta
    "্": "",

    // Vowel signs
    "া": "a",
    "ি": "i",
    "ী": "i",
    "ু": "u",
    "ূ": "u",
    "ৃ": "ri",
    "ে": "e",
    "ৈ": "oi",
    "ো": "o",
    "ৌ": "ou",

    // Bengali numbers
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };

  return text
    .toString()
    .split("")
    .map((char) => map[char] ?? char)
    .join("");
}

// =====================================================
// CREATE ROMAN SLUG
// =====================================================

function createSimpleSlug(text) {
  if (!text) return "no-slug";

  const romanText = banglaToRoman(text);

  const slug = romanText
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
// MAKE UNIQUE SLUG
// =====================================================

async function makeUniqueSlug(baseSlug, id = null) {
  const cleanBaseSlug = baseSlug || "no-slug";

  let finalSlug = cleanBaseSlug;
  let count = 1;

  while (
    await BanglaQuestion.findOne({
      slug: finalSlug,
      ...(id
        ? {
            _id: {
              $ne: id,
            },
          }
        : {}),
    })
  ) {
    finalSlug = `${cleanBaseSlug}-${count}`;
    count++;
  }

  return finalSlug;
}

// =====================================================
// CREATE BANGLA QUESTION
// POST /api/bn/questions
// =====================================================

exports.createBanglaQuestion = async (req, res) => {
  try {
    console.log("=================================");
    console.log("BANGLA QUESTION BODY:", req.body);
    console.log("=================================");

    const {
      question,
      answer,
      hawala1,
      hawala2,
      hawala3,
      metaTitle,
      metaDescription,
      keywords,
      category,
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

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
        message: "Bangla category is required",
      });
    }

    // -------------------------------------------------
    // ALWAYS GENERATE ROMAN SLUG FROM QUESTION
    // -------------------------------------------------

    const generatedSlug = createSimpleSlug(question);

    const finalSlug = await makeUniqueSlug(
      generatedSlug
    );

    console.log("Generated Roman Slug:", generatedSlug);
    console.log("Final Roman Slug:", finalSlug);

    // -------------------------------------------------
    // KEYWORDS
    // -------------------------------------------------

    const keywordArray = parseKeywords(keywords);

    // -------------------------------------------------
    // CREATE QUESTION
    // -------------------------------------------------

    const newQuestion =
      await BanglaQuestion.create({
        question: question.trim(),

        answer: answer.trim(),

        hawala1: hawala1?.trim() || "",

        hawala2: hawala2?.trim() || "",

        hawala3: hawala3?.trim() || "",

        // IMPORTANT:
        // Always save Roman slug
        slug: finalSlug,

        metaTitle:
          metaTitle?.trim() ||
          question.trim(),

        metaDescription:
          metaDescription?.trim() ||
          stripHtml(answer).slice(0, 155),

        keywords: keywordArray,

        category,
      });

    // -------------------------------------------------
    // SUCCESS
    // -------------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Bangla question added successfully",

      data: newQuestion,
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
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .populate("category");

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
          {
            slug: slug,
          },
          {
            oldSlugs: slug,
          },
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
// PUT /api/bn/questions/:id
// =====================================================

exports.updateBanglaQuestion = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const existing =
      await BanglaQuestion.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message:
          "Bangla question not found",
      });
    }

    const {
      question,
      answer,
      hawala1,
      hawala2,
      hawala3,
      slug,
      metaTitle,
      metaDescription,
      keywords,
      category,
    } = req.body;

    // =================================================
    // QUESTION
    // =================================================

    if (question !== undefined) {
      if (!question.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Bangla question is required",
        });
      }

      existing.question =
        question.trim();
    }

    // =================================================
    // ANSWER
    // =================================================

    if (answer !== undefined) {
      if (!answer.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Bangla answer is required",
        });
      }

      existing.answer =
        answer.trim();
    }

    // =================================================
    // HAWALA
    // =================================================

    if (hawala1 !== undefined) {
      existing.hawala1 =
        hawala1.trim();
    }

    if (hawala2 !== undefined) {
      existing.hawala2 =
        hawala2.trim();
    }

    if (hawala3 !== undefined) {
      existing.hawala3 =
        hawala3.trim();
    }

    // =================================================
    // CATEGORY
    // =================================================

    if (category !== undefined) {
      if (!category) {
        return res.status(400).json({
          success: false,
          message:
            "Bangla category is required",
        });
      }

      existing.category = category;
    }

    // =================================================
    // META TITLE
    // =================================================

    if (metaTitle !== undefined) {
      existing.metaTitle =
        metaTitle.trim();
    }

    // =================================================
    // META DESCRIPTION
    // =================================================

    if (metaDescription !== undefined) {
      existing.metaDescription =
        metaDescription.trim();
    }

    // =================================================
    // KEYWORDS
    // =================================================

    if (keywords !== undefined) {
      existing.keywords =
        parseKeywords(keywords);
    }

    // =================================================
    // SLUG
    // =================================================

    if (
      slug !== undefined &&
      slug.trim()
    ) {
      const cleanSlug =
        createSimpleSlug(slug);

      const finalSlug =
        await makeUniqueSlug(
          cleanSlug,
          id
        );

      // Save previous slug
      if (
        existing.slug &&
        existing.slug !== finalSlug
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

      existing.slug =
        finalSlug;
    }

    // =================================================
    // AUTO META TITLE
    // =================================================

    if (
      metaTitle !== undefined &&
      !metaTitle.trim() &&
      question !== undefined
    ) {
      existing.metaTitle =
        question.trim();
    }

    // =================================================
    // AUTO META DESCRIPTION
    // =================================================

    if (
      metaDescription !== undefined &&
      !metaDescription.trim() &&
      answer !== undefined
    ) {
      existing.metaDescription =
        stripHtml(answer).slice(
          0,
          155
        );
    }

    // =================================================
    // SAVE
    // =================================================

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
    const { id } = req.params;

    const question =
      await BanglaQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Bangla question not found",
      });
    }

    await BanglaQuestion.findByIdAndDelete(
      id
    );

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