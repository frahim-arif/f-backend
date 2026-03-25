
const mongoose = require("mongoose");
const slugify = require("slugify");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  hawala1: { type: String },
  hawala2: { type: String },
  hawala3: { type: String },
  category: { type: String, required: true },
  slug: { type: String, unique: true }, // ✅ slug field
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to generate slug from question
questionSchema.pre("save", function (next) {
  if (this.isModified("question") || !this.slug) {
    this.slug = slugify(this.question, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Question", questionSchema);
