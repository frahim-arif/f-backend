const mongoose = require("mongoose");

const englishCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.EnglishCategory ||
  mongoose.model(
    "EnglishCategory",
    englishCategorySchema
  );