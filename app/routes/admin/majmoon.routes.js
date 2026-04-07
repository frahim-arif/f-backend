module.exports = (app) => {
  const Majmoon = require('../../models/majmoon.model');

  // ✅ ADD MAJMOON
  app.post('/api/admin/majameen', async (req, res) => {
    try {
      const majmoon = await Majmoon.create(req.body);
      res.json({ success: true, majmoon });
    } catch (err) {
      res.json({ success: false, error: err.message });
    }
  });

  // ✅ GET ALL
  app.get('/api/majameen', async (req, res) => {
    try {
      const data = await Majmoon.find().sort({ createdAt: -1 });
      res.json({ success: true, data });
    } catch (err) {
      res.json({ success: false, error: err.message });
    }
  });

  // ✅ GET SINGLE
  app.get('/api/majameen/:id', async (req, res) => {
    try {
      const item = await Majmoon.findById(req.params.id);
      res.json({ success: true, item });
    } catch (err) {
      res.json({ success: false, error: err.message });
    }
  });
};