
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// =====================================================
// CATEGORY SCHEMA
// =====================================================

const categorySchema = new mongoose.Schema({
  // Urdu
  name: {
    type: String,
    required: true,
    trim: true,
  },

  // English
  englishName: {
    type: String,
    required: true,
    trim: true,
  },

  // Bangla
  banglaName: {
    type: String,
    required: true,
    trim: true,
  },

  // Common slug
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema);

// =====================================================
// SEED DEFAULT CATEGORIES
// =====================================================

router.get("/seed", async (req, res) => {
  try {
    const defaultCategories = [
      {
        name: "جدید مسائل",
        englishName: "Modern Issues",
        banglaName: "আধুনিক বিষয়সমূহ",
        slug: "jadeed-masail",
      },
      {
        name: "نماز",
        englishName: "Prayer",
        banglaName: "নামাজ",
        slug: "namaz",
      },
      {
        name: "حج",
        englishName: "Hajj",
        banglaName: "হজ",
        slug: "hajj",
      },
      {
        name: "زکوٰۃ",
        englishName: "Zakat",
        banglaName: "যাকাত",
        slug: "zakat",
      },
      {
        name: "قربانی",
        englishName: "Qurbani",
        banglaName: "কুরবানি",
        slug: "qurbani",
      },
      {
        name: "نکاح",
        englishName: "Nikah",
        banglaName: "নিকাহ",
        slug: "nikah",
      },
      {
        name: "عقیقہ",
        englishName: "Aqiqah",
        banglaName: "আকিকা",
        slug: "aqiqah",
      },
      {
        name: "طہارت",
        englishName: "Purification",
        banglaName: "পবিত্রতা",
        slug: "taharat",
      },
      {
        name: "بیوع",
        englishName: "Business Transactions",
        banglaName: "ব্যবসায়িক লেনদেন",
        slug: "buyuo",
      },
      {
        name: "رمضان",
        englishName: "Ramadan",
        banglaName: "রমজান",
        slug: "ramzan",
      },
    ];

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({
        slug: cat.slug,
      });

      if (!exists) {
        await Category.create(cat);
      } else {
        // Existing categories mein bhi English/Bangla add/update
        await Category.updateOne(
          { slug: cat.slug },
          {
            $set: {
              name: cat.name,
              englishName: cat.englishName,
              banglaName: cat.banglaName,
            },
          }
        );
      }
    }

    res.json({
      success: true,
      message:
        "✅ Urdu, English & Bangla categories seeded successfully!",
    });
  } catch (error) {
    console.error("CATEGORY SEED ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET ALL CATEGORIES
// GET /api/categories
// =====================================================

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET SINGLE CATEGORY
// GET /api/categories/:slug
// =====================================================

router.get("/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

