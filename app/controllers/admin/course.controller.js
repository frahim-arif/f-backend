// controllers/courseController.js
import Course from "../../models/Course.js";

// helper: full link ya ID se sirf ID nikalta hai
const extractYouTubeId = (urlOrId) => {
  if (!urlOrId) return "";
  const match = urlOrId.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([\w-_]+)/);
  return match ? match[1] : urlOrId;
};

export const addLessonToCourse = async (req, res) => {
  try {
    let { title, youtubeId } = req.body;
    const { id } = req.params;

    // trim + sanitize
    title = title?.trim();
    youtubeId = extractYouTubeId(youtubeId?.trim());

    if (!title || !youtubeId) {
      return res
        .status(400)
        .json({ message: "Title & valid YouTube ID required" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.lessons.push({
      title,
      youtubeId,
    });

    await course.save();

    res.status(200).json({
      message: "Lesson added successfully",
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
