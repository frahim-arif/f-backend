const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, unique: true, index: true },
    firstSeen: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now, index: true },
    visits: { type: Number, default: 0 },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Visitor", visitorSchema);