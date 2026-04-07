const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  image: String,
  pdf: String
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);