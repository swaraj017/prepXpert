const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: {
    type: String, // Clerk user ID as string
    required: true,
  },
  role: String,
  experience: String,
  topicsToFocus: [String],
  description: String,
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",  
    },
  ],
}, { timestamps: true });  

module.exports = mongoose.model("Session", sessionSchema);
