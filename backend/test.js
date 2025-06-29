require('dotenv').config(); // Load .env file

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI({
   apiKey: process.env.GEMINI_API_KEY,
});

async function generate() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent("List 3 AI use cases.");
  const response = result.response;
  const text = await response.text();
  console.log(text);
}

generate().catch(console.error);
