const express = require("express");
const router = express.Router();

const BanglaCategory = require("../../models/banglaCategory.model");

// =====================================================
// SEED BANGLA CATEGORIES
// GET /api/bn/categories/seed
// =====================================================

router.get("/seed", async (req, res) => {
  try {
    const defaultCategories = [
      {
        name: "আধুনিক বিষয়সমূহ",
        slug: "jadeed-masail",
      },
      {
        name: "নামাজ",
        slug: "namaz",
      },
      {
        name: "হজ",
        slug: "hajj",
      },
      {
        name: "যাকাত",
        slug: "zakat",
      },
      {
        name: "কুরবানি",
        slug: "qurbani",
      },
      {
        name: "নিকাহ",
        slug: "nikah",
      },
      {
        name: "আকিকা",
        slug: "aqiqah",
      },
      {
        name: "পবিত্রতা",
        slug: "taharat",
      },
      {
        name: "ব্যবসায়িক লেনদেন",
        slug: "buyuo",
      },
      {
        name: "রমজান",
        slug: "ramzan",
      },
    ];

    for (const cat of defaultCategories) {
      const exists =
        await BanglaCategory.findOne({
          slug: cat.slug,
        });

      if (!exists) {
        await BanglaCategory.create(cat);
      }
    }

    res.json({
      success: true,
      message:
        "Bangla categories seeded successfully!",
    });
  } catch (error) {
    console.error(
      "BANGLA CATEGORY SEED ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET ALL BANGLA CATEGORIES
// GET /api/bn/categories
// =====================================================

router.get("/", async (req, res) => {
  try {
    const categories =
      await BanglaCategory.find()
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(
      "BANGLA CATEGORY GET ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET SINGLE BANGLA CATEGORY
// GET /api/bn/categories/:slug
// =====================================================

router.get("/:slug", async (req, res) => {
  try {
    const category =
      await BanglaCategory.findOne({
        slug: req.params.slug,
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Bangla category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(
      "BANGLA CATEGORY SINGLE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;