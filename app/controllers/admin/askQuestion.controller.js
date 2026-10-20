const AskQuestion = require("../../models/AskQuestion");

// PUBLIC: sawal bhejna
exports.createAskQuestion = async (req, res) => {
  try {
    const { name, contact, question, website } = req.body;

    // honeypot: bots hidden field bhar dete hain
    if (website) return res.json({ success: true });

    if (!name?.trim() || !question?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "نام اور سوال ضروری ہیں" });
    }

    await AskQuestion.create({ name, contact, question });
    res.json({ success: true });
  } catch (err) {
    console.error("createAskQuestion error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADMIN: aaye hue sawal dekhna
exports.getAskQuestions = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const data = await AskQuestion.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADMIN: status badalna
exports.updateAskStatus = async (req, res) => {
  try {
    const data = await AskQuestion.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADMIN: delete
exports.deleteAskQuestion = async (req, res) => {
  try {
    await AskQuestion.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUBLIC: sirf approved sawal, contact ke bina
exports.getPublicAskQuestions = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip, 10) || 0;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 30);

    const rows = await AskQuestion.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name question status createdAt");

    const data = rows.map((r) => ({
      _id: r._id,
      name: (r.name || "").trim().split(/\s+/)[0] || "نامعلوم",
      question: r.question,
      status: r.status,
      createdAt: r.createdAt,
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error("getPublicAskQuestions error:", err);
    res.status(500).json({ success: false });
  }
};

// ADMIN: sawal ko public / private karna
exports.updateAskPublic = async (req, res) => {
  try {
    const data = await AskQuestion.findByIdAndUpdate(
      req.params.id,
      { isPublic: !!req.body.isPublic },
      { new: true }
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};