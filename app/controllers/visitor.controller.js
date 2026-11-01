const Visitor = require("../models/Visitor");

const IST = 5.5 * 60 * 60 * 1000;

const startOfTodayIST = () => {
  const d = new Date(Date.now() + IST);
  d.setUTCHours(0, 0, 0, 0);
  return new Date(d.getTime() - IST);
};

let cache = null;
let cacheAt = 0;

exports.ping = async (req, res) => {
  try {
    const { visitorId } = req.body || {};
    const ua = String(req.headers["user-agent"] || "");

    // bots ko ginti me nahi
    if (/bot|crawl|spider|slurp|facebookexternalhit|preview/i.test(ua)) {
      return res.json({ success: true });
    }

    if (typeof visitorId !== "string" || !/^[A-Za-z0-9_-]{8,64}$/.test(visitorId)) {
      return res.status(400).json({ success: false });
    }

    const now = new Date();

    await Visitor.updateOne(
      { visitorId },
      {
        $set: { lastSeen: now },
        $inc: { visits: 1 },
        $setOnInsert: { firstSeen: now },
      },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("visitor ping error:", err);
    res.status(500).json({ success: false });
  }
};

exports.stats = async (req, res) => {
  try {
    if (cache && Date.now() - cacheAt < 60 * 1000) {
      return res.json({ success: true, data: cache });
    }

    const [total, today, agg] = await Promise.all([
      Visitor.countDocuments(),
      Visitor.countDocuments({ lastSeen: { $gte: startOfTodayIST() } }),
      Visitor.aggregate([{ $group: { _id: null, visits: { $sum: "$visits" } } }]),
    ]);

    cache = { total, today, visits: agg[0]?.visits || 0 };
    cacheAt = Date.now();

    res.json({ success: true, data: cache });
  } catch (err) {
    console.error("visitor stats error:", err);
    res.status(500).json({ success: false });
  }
};