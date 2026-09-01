const mongoose = require("mongoose");

const banglaQuestionSchema = new mongoose.Schema(
  {
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
    },

    hawala2: {
      type: String,
      default: "",
    },

    hawala3: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BanglaCategory",
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
      index: true,
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
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.BanglaQuestion ||
  mongoose.model("BanglaQuestion", banglaQuestionSchema);