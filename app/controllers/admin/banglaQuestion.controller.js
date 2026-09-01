const BanglaQuestion = require("../../models/banglaQuestion.model");

function stripHtml(text = "") {
  return text
    .toString()
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
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

async function makeUniqueSlug(baseSlug, id = null) {
  const cleanBaseSlug = baseSlug || "no-slug";

  let finalSlug = cleanBaseSlug;
  let count = 1;

  while (
    await BanglaQuestion.findOne({
      slug: finalSlug,
      ...(id ? { _id: { $ne: id } } : {}),
    })
  ) {
    finalSlug = `${cleanBaseSlug}-${count}`;
    count++;
  }

  return finalSlug;
}

exports.createBanglaQuestion = async (req, res) => {
  try {
    console.log("BANGLA QUESTION BODY:", req.body);

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

    const generatedSlug =
      slug?.trim() ||
      createSimpleSlug(question);

    const finalSlug =
      await makeUniqueSlug(generatedSlug);

    const keywordArray =
      parseKeywords(keywords);

    const newQuestion =
      await BanglaQuestion.create({
        question: question.trim(),

        answer: answer.trim(),

        hawala1: hawala1?.trim() || "",

        hawala2: hawala2?.trim() || "",

        hawala3: hawala3?.trim() || "",

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

    if (metaTitle !== undefined) {
      existing.metaTitle =
        metaTitle.trim();
    }

    if (metaDescription !== undefined) {
      existing.metaDescription =
        metaDescription.trim();
    }

    if (keywords !== undefined) {
      existing.keywords =
        parseKeywords(keywords);
    }

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

      existing.slug = finalSlug;
    }

    if (
      metaTitle !== undefined &&
      !metaTitle.trim() &&
      question !== undefined
    ) {
      existing.metaTitle =
        question.trim();
    }

    if (
      metaDescription !== undefined &&
      !metaDescription.trim() &&
      answer !== undefined
    ) {
      existing.metaDescription =
        stripHtml(answer).slice(0, 155);
    }

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