const express = require("express");
const router = express.Router();
const Course = require("../../models/Course");

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET single course by slug
router.get("/:slug", async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    res.json(course);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
