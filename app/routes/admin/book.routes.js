module.exports = (app) => {
  const Book = require('../../models/book.model');

  // ✅ ADD BOOK
  app.post('/api/admin/books', async (req, res) => {
    try {
      const book = await Book.create(req.body);
      res.json({ success: true, book });
    } catch (err) {
      res.json({ success: false, error: err.message });
    }
  });

  // ✅ GET ALL BOOKS
  app.get('/api/books', async (req, res) => {
    try {
      const books = await Book.find().sort({ createdAt: -1 });
      res.json({ success: true, books });
    } catch (err) {
      res.json({ success: false, error: err.message });
    }
  });
  // ✅ DELETE BOOK
app.delete('/api/admin/books/:id', async (req, res) => {

  try {

    const deleted = await Book.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.json({
        success: false,
        message: 'Book not found',
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully',
    });

  } catch (err) {

    res.json({
      success: false,
      error: err.message,
    });

  }

});


  // ✅ GET SINGLE BOOK
  app.get('/api/books/:id', async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      res.json({ success: true, book });
    } catch (err) {
      res.json({ success: false, error: err.message });
    }
  });
};