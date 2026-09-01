
const EnglishQuestion = require("../../models/englishQuestion.model");

// =====================================================
// CREATE ENGLISH QUESTION
// =====================================================

exports.createEnglishQuestion = async (req, res) => {
  try {
    console.log("ENGLISH QUESTION BODY:", req.body);

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

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        message: "English question is required",
      });
    }

    if (!answer?.trim()) {
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

    // =====================================================
    // GENERATE SLUG
    // =====================================================

    let generatedSlug =
      slug?.trim() ||
      question
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    // =====================================================
    // UNIQUE SLUG
    // =====================================================

    let finalSlug = generatedSlug;
    let count = 1;

    while (
      await EnglishQuestion.findOne({
        slug: finalSlug,
      })
    ) {
      finalSlug = `${generatedSlug}-${count}`;
      count++;
    }

    // =====================================================
    // KEYWORDS
    // =====================================================

    const keywordArray = Array.isArray(keywords)
      ? keywords
      : (keywords || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    // =====================================================
    // CREATE QUESTION
    // =====================================================

    const newQuestion = await EnglishQuestion.create({
      question: question.trim(),

      answer: answer.trim(),

      hawala1: hawala1?.trim() || "",
      hawala2: hawala2?.trim() || "",
      hawala3: hawala3?.trim() || "",

      slug: finalSlug,

      metaTitle:
        metaTitle?.trim() || question.trim(),

      metaDescription:
        metaDescription?.trim() ||
        answer
          .replace(/<[^>]*>/g, "")
          .slice(0, 155),

      keywords: keywordArray,

      category,
    });

    // =====================================================
    // SUCCESS
    // =====================================================

    return res.status(201).json({
      success: true,
      message: "English question added successfully",
      data: newQuestion,
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
// =====================================================

exports.getEnglishQuestions = async (req, res) => {
  try {
    const limit =
      parseInt(req.query.limit) || 10;

    const skip =
      parseInt(req.query.skip) || 0;

    const questions =
      await EnglishQuestion.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category");

    return res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error(
      "❌ ENGLISH GET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ENGLISH QUESTION BY SLUG
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
// =====================================================

exports.updateEnglishQuestion = async (
  req,
  res
) => {
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

    // =====================================================
    // CONTENT
    // =====================================================

    if (question !== undefined) {
      if (!question.trim()) {
        return res.status(400).json({
          success: false,
          message: "English question is required",
        });
      }

      existing.question = question.trim();
    }

    if (answer !== undefined) {
      if (!answer.trim()) {
        return res.status(400).json({
          success: false,
          message: "English answer is required",
        });
      }

      existing.answer = answer.trim();
    }

    // =====================================================
    // HAWALA
    // =====================================================

    if (hawala1 !== undefined) {
      existing.hawala1 = hawala1;
    }

    if (hawala2 !== undefined) {
      existing.hawala2 = hawala2;
    }

    if (hawala3 !== undefined) {
      existing.hawala3 = hawala3;
    }

    // =====================================================
    // CATEGORY
    // =====================================================

    if (category !== undefined) {
      existing.category = category;
    }

    // =====================================================
    // SEO
    // =====================================================

    if (metaTitle !== undefined) {
      existing.metaTitle = metaTitle;
    }

    if (metaDescription !== undefined) {
      existing.metaDescription =
        metaDescription;
    }

    if (keywords !== undefined) {
      existing.keywords = Array.isArray(
        keywords
      )
        ? keywords
        : keywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    // =====================================================
    // SLUG
    // =====================================================

    if (slug !== undefined && slug.trim()) {
      const cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      let finalSlug = cleanSlug;
      let count = 1;

      while (
        await EnglishQuestion.findOne({
          slug: finalSlug,
          _id: { $ne: id },
        })
      ) {
        finalSlug = `${cleanSlug}-${count}`;
        count++;
      }

      // Save old slug
      if (
        existing.slug &&
        existing.slug !== finalSlug
      ) {
        if (!existing.oldSlugs) {
          existing.oldSlugs = [];
        }

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

    // =====================================================
    // SAVE
    // =====================================================

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

