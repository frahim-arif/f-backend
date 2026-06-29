const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Majmoon = require("../../models/majmoon.model");

// GET ALL MAJAMEEN
router.get("/", async (req, res) => {
  try {
    const data = await Majmoon.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET SINGLE MAJMOON
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const item = await Majmoon.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Majmoon not found",
      });
    }

    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;