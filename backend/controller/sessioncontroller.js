const Session = require('../models/session');
const Question = require('../models/Questions');

exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } = req.body;
    const userId = req.auth.userId;

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const createdQuestions = await Promise.all(
      questions.map((q) =>
        Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        })
      )
    );

    session.questions = createdQuestions.map((q) => q._id);
    await session.save();

    res.status(201).json({ message: 'Session created', session });
  } catch (error) {
    console.error('Create session error:', error.message);
    res.status(500).json({ message: 'Could not create session' });
  }
};

exports.getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.auth.userId }).sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error.message);
    res.status(500).json({ message: 'Could not get sessions' });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate({
      path: 'questions',
      options: { sort: { isPinned: -1, createdAt: 1 } },
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({ session });

  } catch (error) {
    console.error('Get session by ID error:', error.message);
    res.status(500).json({ message: 'Could not get session' });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await Question.deleteMany({ session: req.params.id });

    res.status(200).json({ message: 'Session deleted' });
  } catch (error) {
    console.error('Delete session error:', error.message);
    res.status(500).json({ message: 'Could not delete session' });
  }
};
