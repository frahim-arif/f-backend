const express = require("express");
const router = express.Router();
const Course = require("../../models/Course");
const { addLessonToCourse } = require("../../controllers/admin/course.controller");


// ADD course
router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADD lesson to existing course
router.put("/:id/lesson", addLessonToCourse);

module.exports = router;
