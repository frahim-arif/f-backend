const Question = require("../models/Question");

module.exports = async function (req, res, next) {
  try {
    const slug = req.params.slug;

    const question = await Question.findOne({
      $or: [
        { slug: slug },
        { oldSlugs: slug }
      ]
    });

    if (!question) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // 🔥 old slug detect -> 301 redirect
    if (question.slug !== slug) {
      return res.redirect(301, `/questions/${question.slug}`);
    }

    req.question = question;
    next();

  } catch (err) {
    console.log("redirect error", err);
    return res.status(500).json({ success: false });
  }
};