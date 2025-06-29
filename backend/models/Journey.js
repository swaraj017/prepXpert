const mongoose = require("mongoose");

const JourneySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  role: { type: String, required: true },
  experience: { type: String, required: true },
  stack: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Journey", JourneySchema);
