// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema({
//   question: { type: String, required: true },

//   answer: { type: String, required: true },

//   hawala1: { type: String },
//   hawala2: { type: String },
//   hawala3: { type: String },

//   category: { type: String, required: true },

//   slug: {
//     type: String,
//     unique: true,
//     lowercase: true,
//     trim: true,
//     index: true,
//   },

//   metaTitle: { type: String },

//   metaDescription: { type: String },

//   keywords: {
//     type: [String],
//     default: [],
//   },

//   oldSlugs: {
//     type: [String],
//     default: [],
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model(
//   "Question",
//   questionSchema
// );




const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    // =====================================================
    // ORIGINAL / URDU
    // =====================================================

    question: {
      type: String,
      trim: true,
      default: "",
    },

    answer: {
      type: String,
      default: "",
    },

    hawala1: {
      type: String,
      default: "",
    },

    hawala2: {
      type: String,
      default: "",
    },

    hawala3: {
      type: String,
      default: "",
    },

    // =====================================================
    // URDU SEO
    // =====================================================

    slug: {
      type: String,
      trim: true,
      default: undefined,
      sparse: true,
    },

    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },

    keywords: {
      type: [String],
      default: [],
    },

    oldSlugs: {
      type: [String],
      default: [],
    },

    // =====================================================
    // ENGLISH
    // =====================================================

    englishQuestion: {
      type: String,
      trim: true,
      default: "",
    },

    englishAnswer: {
      type: String,
      default: "",
    },

    englishHawala1: {
      type: String,
      default: "",
    },

    englishHawala2: {
      type: String,
      default: "",
    },

    englishHawala3: {
      type: String,
      default: "",
    },

    englishSlug: {
      type: String,
      trim: true,
      default: undefined,
      unique: true,
      sparse: true,
    },

    englishMetaTitle: {
      type: String,
      default: "",
    },

    englishMetaDescription: {
      type: String,
      default: "",
    },

    englishKeywords: {
      type: [String],
      default: [],
    },

    oldEnglishSlugs: {
      type: [String],
      default: [],
    },

    // =====================================================
    // BANGLA
    // =====================================================

    banglaQuestion: {
      type: String,
      trim: true,
      default: "",
    },

    banglaAnswer: {
      type: String,
      default: "",
    },

    banglaHawala1: {
      type: String,
      default: "",
    },

    banglaHawala2: {
      type: String,
      default: "",
    },

    banglaHawala3: {
      type: String,
      default: "",
    },

    banglaSlug: {
      type: String,
      trim: true,
      default: undefined,
      unique: true,
      sparse: true,
    },

    banglaMetaTitle: {
      type: String,
      default: "",
    },

    banglaMetaDescription: {
      type: String,
      default: "",
    },

    banglaKeywords: {
      type: [String],
      default: [],
    },

    oldBanglaSlugs: {
      type: [String],
      default: [],
    },

    // =====================================================
    // CATEGORY
    // =====================================================

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);


