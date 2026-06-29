const express = require("express");
const router = express.Router();
const Majmoon = require("../../models/majmoon.model");

// ADD MAJMOON
router.post("/", async (req, res) => {
  try {
    const majmoon = await Majmoon.create(req.body);
    res.json({ success: true, majmoon });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE MAJMOON
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Majmoon.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Majmoon not found",
      });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;