// const mongoose = require("mongoose");

// const categorySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   slug: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Category", categorySchema);


const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    // Urdu / Default Category Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Main slug
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // English Category Name
    englishName: {
      type: String,
      trim: true,
      default: "",
    },

    // Bangla Category Name
    banglaName: {
      type: String,
      trim: true,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
