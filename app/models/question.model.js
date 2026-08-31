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

    // Urdu category
    category: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // URDU SEO
    // =====================================================

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
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
   
    
);

module.exports = mongoose.model("Question", questionSchema);

