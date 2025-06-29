const mongoose = require("mongoose");
const Session = require("../models/session");
const Question = require("../models/Questions");
const Questions = require("../models/Questions");

exports.addQuesToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID format" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();

    res.status(201).json(createdQuestions);
  } catch (error) {
    console.error("Error adding questions:", error);
    res.status(500).json({ message: "Failed to add questions", error: error.message });
  }
};



exports.updateQues = async (req, res) => {
  try {
    const { note } = req.body;
    const question = await Questions.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    question.note = note || "";
    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
exports.toggleQues = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("[PIN TOGGLE] Received ID:", id);

    const question = await Question.findById(id);
    if (!question) {
      console.log("[PIN TOGGLE]   Question not found for ID:", id);
      return res.status(404).json({ message: "Question not found" });
    }

    console.log("[PIN TOGGLE] Current isPinned:", question.isPinned);
    question.isPinned = !question.isPinned;
    await question.save();

    console.log("[PIN TOGGLE] Updated isPinned:", question.isPinned);

    res.status(200).json({
      message: "Question pin toggled",
      isPinned: question.isPinned,
    });
  } catch (err) {
    console.error("[PIN TOGGLE]   Server error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
