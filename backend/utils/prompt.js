// prompt.js

/**
 * Generates a prompt for technical interview questions and answers.
 *
 * @param {string} role - The role for the interview (e.g., "Frontend Developer").
 * @param {string} experience - The experience level (e.g., "Mid-level", "Senior").
 * @param {string|string[]} topicsToFocus - A single topic string or an array of topics to focus on.
 * @param {number} numberOfQuestions - The number of questions to generate.
 * @returns {string} The formatted prompt string.
 */
const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => `
You are an AI trained to generate detailed and insightful technical interview questions and answers.

Role: ${role}
Experience Level: ${experience}
Topics: ${Array.isArray(topicsToFocus) ? topicsToFocus.join(", ") : topicsToFocus}
Number of Questions: ${numberOfQuestions}

Generate ${numberOfQuestions} clear and comprehensive technical interview questions.
Each entry should include:
- A question
- A detailed, yet understandable explanation or answer, covering the 'what', 'why', and 'how'. Aim for 3-5 sentences for core concepts.
- A concise and illustrative code snippet if applicable, demonstrating the concept.

⚠️ Output format:
[
  {
    "question": "Explain closures in JavaScript.",
    "answer": "A closure is a function bundled together with its lexical environment, allowing it to access variables from its outer (enclosing) function even after the outer function has finished executing. They are important for data privacy and creating factory functions, enabling private variables in JavaScript. For example, a closure can remember and update a counter variable defined in an outer function.",
    "code": "function outer() {\\n  let counter = 0;\\n  function inner() {\\n    counter++;\\n    return counter;\\n  }\\n  return inner;\\n}\\nconst myCounter = outer();\\nconsole.log(myCounter()); // 1"
  },
  ...
]

❗ IMPORTANT RULES:
- Return ONLY a raw JSON array (no markdown, no \`\`\`, no commentary).
- Do NOT include any explanation, markdown formatting, or code fences.
- Ensure the 'answer' field provides substantial detail without being overly verbose.
`;

/**
 * Generates a prompt for explaining a technical concept.
 *
 * @param {string} question - The technical concept to explain.
 * @returns {string} The formatted prompt string.
 */

 const conceptExplainPrompt = (question) => `
You are an AI trained to explain technical interview concepts clearly and concisely.

Topic: "${question}"

Explain this concept to a junior developer using a structured explanation with the following sections:
- What it is
- Why it's important
- How it's used
- Real-World Analogy
- Code Snippet (if applicable, use the most relevant technology: shell script, GitHub Actions, Dockerfile, Terraform, Kubernetes YAML, etc.)
- Summary

⚠️ Output format:
{
  "title": "Concept Title",
  "explanation": "### What is it?\\n...\\n\\n### Why is it important?\\n...\\n\\n### How is it used?\\n...\\n\\n### Real-World Analogy\\n...\\n\\n### Example Code (use the most relevant technology)\\n\\n\\\`\\\`\\\`<language>\\n// code here\\n\\\`\\\`\\\`\\n\\n### Summary\\n..."
}

❗ IMPORTANT:
- Return ONLY a valid JSON object (no markdown or code fences around it).
- The value of the 'explanation' field must be a single properly escaped string using \\n for newlines.
- Code snippets must be inside triple-escaped markdown blocks: \\\`\\\`\\\`<lang>\\n...\\n\\\`\\\`\\\`
- Use 'yaml', 'bash', 'dockerfile', 'js', or other real-world formats — not always Node.js.
- Do NOT wrap the entire JSON in \`\`\` or any markdown formatting.
- Follow proper JSON syntax strictly.
`;



// Exporting the prompt functions for use in other files
module.exports = { questionAnswerPrompt, conceptExplainPrompt };