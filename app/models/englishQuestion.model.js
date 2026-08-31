const mongoose = require("mongoose");

const englishQuestionSchema = new mongoose.Schema(
  {
    // =====================================================
    // ENGLISH CONTENT
    // =====================================================

    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
    },

    hawala1: {
      type: String,
      default: "",
      trim: true,
    },

    hawala2: {
      type: String,
      default: "",
      trim: true,
    },

    hawala3: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================================
    // ENGLISH CATEGORY
    // =====================================================

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EnglishCategory",
      required: true,
    },

    // =====================================================
    // ENGLISH SEO
    // =====================================================

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },

    keywords: {
      type: [String],
      default: [],
    },

    oldSlugs: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.EnglishQuestion ||
  mongoose.model(
    "EnglishQuestion",
    englishQuestionSchema
  );