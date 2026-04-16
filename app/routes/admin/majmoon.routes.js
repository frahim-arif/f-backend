module.exports = (app) => {
  const Majmoon = require('../../models/majmoon.model');
  const mongoose = require('mongoose');

  // ✅ ADD MAJMOON
  app.post('/api/admin/majameen', async (req, res) => {
    try {
      const majmoon = await Majmoon.create(req.body);

      res.json({
        success: true,
        majmoon
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  });

  // ✅ GET ALL MAJAMEEN
  app.get('/api/majameen', async (req, res) => {
    try {
      const data = await Majmoon.find().sort({ createdAt: -1 });

      res.json({
        success: true,
        data
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  });

  // ✅ DELETE MAJMOON
  app.delete('/api/admin/majameen/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await Majmoon.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Majmoon not found"
        });
      }

      res.json({
        success: true,
        message: "Deleted successfully"
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  });

  // ✅ GET SINGLE MAJMOON (🔥 FIXED)
  app.get('/api/majameen/:id', async (req, res) => {
    try {
      const { id } = req.params;

      // 🔥 ID validation (important)
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID"
        });
      }

      const item = await Majmoon.findById(id);

      // 🔥 null check (MAIN FIX)
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Majmoon not found"
        });
      }

      res.json({
        success: true,
        item
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  });
};