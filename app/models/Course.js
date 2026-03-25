const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  youtubeId: {
    type: String,
    required: true,
  },
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  lessons: [LessonSchema],
});

module.exports = mongoose.model("Course", CourseSchema);
