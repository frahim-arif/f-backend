const express = require("express");
const router = express.Router();

const EnglishCategory = require(
  "../../models/englishCategory.model"
);

// =====================================================
// SEED ENGLISH CATEGORIES
// GET /api/en/categories/seed
// =====================================================

router.get("/seed", async (req, res) => {
  try {
    const defaultCategories = [
      {
        name: "Modern Issues",
        slug: "jadeed-masail",
      },
      {
        name: "Prayer",
        slug: "namaz",
      },
      {
        name: "Hajj",
        slug: "hajj",
      },
      {
        name: "Zakat",
        slug: "zakat",
      },
      {
        name: "Qurbani",
        slug: "qurbani",
      },
      {
        name: "Nikah",
        slug: "nikah",
      },
      {
        name: "Aqiqah",
        slug: "aqiqah",
      },
      {
        name: "Purification",
        slug: "taharat",
      },
      {
        name: "Business Transactions",
        slug: "buyuo",
      },
      {
        name: "Ramadan",
        slug: "ramzan",
      },
    ];

    for (const cat of defaultCategories) {
      await EnglishCategory.findOneAndUpdate(
        { slug: cat.slug },
        {
          $set: {
            name: cat.name,
            slug: cat.slug,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    const total =
      await EnglishCategory.countDocuments();

    const categories =
      await EnglishCategory.find().sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      message:
        "English categories seeded successfully!",
      total,
      data: categories,
    });
  } catch (error) {
    console.error(
      "ENGLISH CATEGORY SEED ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET ALL ENGLISH CATEGORIES
// GET /api/en/categories
// =====================================================

router.get("/", async (req, res) => {
  try {
    const categories =
      await EnglishCategory.find().sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(
      "ENGLISH CATEGORY GET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET SINGLE ENGLISH CATEGORY
// GET /api/en/categories/:slug
// =====================================================

router.get("/:slug", async (req, res) => {
  try {
    const category =
      await EnglishCategory.findOne({
        slug: req.params.slug,
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "English category not found",
      });
    }

    return res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(
      "ENGLISH CATEGORY SINGLE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;