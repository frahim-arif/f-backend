const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },

  answer: { type: String, required: true },

  hawala1: { type: String },
  hawala2: { type: String },
  hawala3: { type: String },

  category: { type: String, required: true },

  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },

  metaTitle: { type: String },

  metaDescription: { type: String },

  keywords: {
    type: [String],
    default: [],
  },

  oldSlugs: {
    type: [String],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Question",
  questionSchema
);