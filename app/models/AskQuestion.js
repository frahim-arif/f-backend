const mongoose = require("mongoose");

const askQuestionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    contact: { type: String, trim: true, maxlength: 100, default: "" },
    question: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["pending", "answered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AskQuestion", askQuestionSchema);