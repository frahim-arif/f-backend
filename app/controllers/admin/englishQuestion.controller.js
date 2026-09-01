const EnglishQuestion = require("../../models/englishQuestion.model");

// =====================================================
// HELPER: GENERATE SLUG
// =====================================================

const generateSlug = (text = "") => {
return text
.toString()
.toLowerCase()
.trim()
.replace(/[^a-z0-9\s-]/g, "")
.replace(/\s+/g, "-")
.replace(/-+/g, "-")
.replace(/^-|-$/g, "");
};

// =====================================================
// HELPER: UNIQUE SLUG
// =====================================================

const getUniqueSlug = async (slug, excludeId = null) => {
let finalSlug = slug;
let count = 1;

while (true) {
const query = {
slug: finalSlug,
};


if (excludeId) {
  query._id = { $ne: excludeId };
}

const exists = await EnglishQuestion.findOne(query);

if (!exists) {
  break;
}

finalSlug = `${slug}-${count}`;
count++;


}

return finalSlug;
};

// =====================================================
// CREATE ENGLISH QUESTION
// POST /api/en/questions
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
// SLUG
// =====================================================

const generatedSlug = generateSlug(
  slug?.trim() || question
);

const finalSlug = await getUniqueSlug(
  generatedSlug
);

// =====================================================
// KEYWORDS
// =====================================================

const keywordArray = Array.isArray(keywords)
  ? keywords
      .map((item) => item?.toString().trim())
      .filter(Boolean)
  : (keywords || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

// =====================================================
// META DESCRIPTION
// =====================================================

const cleanAnswer = answer
  .replace(/<[^>]*>/g, "")
  .replace(/\s+/g, " ")
  .trim();

const finalMetaTitle =
  metaTitle?.trim() || question.trim();

const finalMetaDescription =
  metaDescription?.trim() ||
  cleanAnswer.slice(0, 155);

// =====================================================
// CREATE
// =====================================================

const newQuestion =
  await EnglishQuestion.create({
    question: question.trim(),

    answer: answer.trim(),

    hawala1: hawala1?.trim() || "",
    hawala2: hawala2?.trim() || "",
    hawala3: hawala3?.trim() || "",

    slug: finalSlug,

    metaTitle: finalMetaTitle,

    metaDescription: finalMetaDescription,

    keywords: keywordArray,

    category,
  });

// Populate category before response
await newQuestion.populate("category");

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
//
// GET /api/en/questions
//
// Examples:
//
// /api/en/questions
// /api/en/questions?limit=10
// /api/en/questions?limit=10&skip=0
// /api/en/questions?category=namaz
// /api/en/questions?category=namaz&limit=100
// /api/en/questions?search=prayer
//
// =====================================================

exports.getEnglishQuestions = async (req, res) => {
try {
const limit = Math.min(
Math.max(parseInt(req.query.limit) || 10, 1),
100
);


const skip = Math.max(
  parseInt(req.query.skip) || 0,
  0
);

const category = req.query.category?.trim();
const search = req.query.search?.trim();

// =====================================================
// BUILD QUERY
// =====================================================

const query = {};

// =====================================================
// CATEGORY FILTER
// =====================================================

if (category) {
  query.category = category;
}

// =====================================================
// SEARCH FILTER
// =====================================================

if (search) {
  query.$or = [
    {
      question: {
        $regex: search,
        $options: "i",
      },
    },
    {
      answer: {
        $regex: search,
        $options: "i",
      },
    },
  ];
}

// =====================================================
// GET QUESTIONS
// =====================================================

const [questions, total] =
  await Promise.all([
    EnglishQuestion.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("category"),

    EnglishQuestion.countDocuments(query),
  ]);

// =====================================================
// SUCCESS
// =====================================================

return res.json({
  success: true,

  data: questions,

  pagination: {
    total,
    limit,
    skip,
    currentPage:
      Math.floor(skip / limit) + 1,
    totalPages:
      Math.ceil(total / limit),
    hasNextPage:
      skip + questions.length < total,
    hasPreviousPage:
      skip > 0,
  },
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
//
// GET /api/en/questions/slug/:slug
// =====================================================

exports.getEnglishQuestionBySlug = async (
req,
res
) => {
try {
const { slug } = req.params;


if (!slug) {
  return res.status(400).json({
    success: false,
    message: "Question slug is required",
  });
}

const question =
  await EnglishQuestion.findOne({
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
      "English question not found",
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
//
// PUT /api/en/questions/:id
// =====================================================

exports.updateEnglishQuestion = async (
req,
res
) => {
try {
const { id } = req.params;

// =====================================================
// FIND EXISTING
// =====================================================

const existing =
  await EnglishQuestion.findById(id);

if (!existing) {
  return res.status(404).json({
    success: false,
    message:
      "English question not found",
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
// QUESTION
// =====================================================

if (question !== undefined) {
  if (!question?.trim()) {
    return res.status(400).json({
      success: false,
      message:
        "English question is required",
    });
  }

  existing.question =
    question.trim();
}

// =====================================================
// ANSWER
// =====================================================

if (answer !== undefined) {
  if (!answer?.trim()) {
    return res.status(400).json({
      success: false,
      message:
        "English answer is required",
    });
  }

  existing.answer =
    answer.trim();
}

// =====================================================
// HAWALA
// =====================================================

if (hawala1 !== undefined) {
  existing.hawala1 =
    hawala1?.trim() || "";
}

if (hawala2 !== undefined) {
  existing.hawala2 =
    hawala2?.trim() || "";
}

if (hawala3 !== undefined) {
  existing.hawala3 =
    hawala3?.trim() || "";
}

// =====================================================
// CATEGORY
// =====================================================

if (category !== undefined) {
  if (!category) {
    return res.status(400).json({
      success: false,
      message:
        "English category is required",
    });
  }

  existing.category = category;
}

// =====================================================
// SEO
// =====================================================

if (metaTitle !== undefined) {
  existing.metaTitle =
    metaTitle?.trim() || "";
}

if (
  metaDescription !== undefined
) {
  existing.metaDescription =
    metaDescription?.trim() || "";
}

// =====================================================
// KEYWORDS
// =====================================================

if (keywords !== undefined) {
  existing.keywords =
    Array.isArray(keywords)
      ? keywords
          .map((item) =>
            item?.toString().trim()
          )
          .filter(Boolean)
      : (keywords || "")
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);
}

// =====================================================
// SLUG
// =====================================================

if (
  slug !== undefined &&
  slug?.trim()
) {
  const cleanSlug =
    generateSlug(slug);

  const finalSlug =
    await getUniqueSlug(
      cleanSlug,
      id
    );

  // Save old slug
  if (
    existing.slug &&
    existing.slug !== finalSlug
  ) {
    if (
      !Array.isArray(
        existing.oldSlugs
      )
    ) {
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

  existing.slug =
    finalSlug;
}

// =====================================================
// SAVE
// =====================================================

await existing.save();

await existing.populate(
  "category"
);

// =====================================================
// SUCCESS
// =====================================================

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
//
// DELETE /api/en/questions/:id
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
    message:
      "English question not found",
  });
}

await EnglishQuestion.findByIdAndDelete(
  id
);

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
