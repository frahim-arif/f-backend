


const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// ✅ Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

// ✅ Seed Default Categories
router.get("/seed", async (req, res) => {
  try {
    const defaultCategories = [
      { name: "جدید مسائل", slug: "jadeed-masail" },
      { name: "نماز", slug: "namaz" },
      { name: "حج", slug: "hajj" },
      { name: "زکوٰۃ", slug: "zakat" },
      { name: "قربانی", slug: "qurbani" },
      { name: "نکاح", slug: "nikah" },
      { name: "عقیقہ", slug: "aqiqah" },
      { name: "طہارت", slug: "taharat" },
      { name: "بیوع", slug: "buyuo" },
      { name: "رمضان", slug: "ramzan" },
    ];

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) await Category.create(cat);
    }

    res.json({ success: true, message: "✅ Categories seeded successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Get All Categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Get single category by slug
router.get("/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
