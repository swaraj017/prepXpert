const { GoogleGenerativeAI } = require('@google/generative-ai');
const { questionAnswerPrompt, conceptExplainPrompt } = require('../utils/prompt');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQues } = req.body;
    if (!role || !experience || !topicsToFocus || !numberOfQues) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQues);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    // Optional: log the raw output for debugging
    console.log("  Gemini raw output:\n", rawText);

    const cleaned = rawText
      .replace(/^```json/, '')
      .replace(/^```/, '')
      .replace(/```$/, '')
      .trim();

    const data = JSON.parse(cleaned);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

 
const generateExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'Missing question field' });
    }

    const prompt = conceptExplainPrompt(question);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    if (!response) throw new Error("No response from Gemini model");

    const rawText = response.text();
    console.log("  Gemini raw response:\n", rawText);

    const cleaned = rawText
      .replace(/^\s*```(?:json|js|ts)?\s*/i, '')
      .replace(/\s*```\s*$/, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);

      if (typeof parsed.explanation !== 'string') {
        parsed.explanation = JSON.stringify(parsed.explanation, null, 2);
      }

      return res.status(200).json(parsed);
    } catch (jsonError) {
      console.warn('  Invalid JSON format. Returning raw explanation.');
      return res.status(200).json({
        title: 'Explanation',
        explanation: cleaned,
        note: 'Returned as plain text because the model output was not valid JSON.',
      });
    }
  } catch (error) {
    console.error('  Error generating explanation:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message || 'Unknown error',
    });
  }
};



module.exports = { generateQuestions, generateExplanation };
