const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    default: "",
    trim: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Question", questionSchema);
