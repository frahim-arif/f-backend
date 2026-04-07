const mongoose = require('mongoose');

const MajmoonSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String
}, { timestamps: true });

module.exports = mongoose.model('Majmoon', MajmoonSchema);