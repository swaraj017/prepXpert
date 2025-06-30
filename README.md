# 🎯 PrepXpert – From Curious to Confident

**PrepXpert** is a smart, AI-driven platform to help you prepare for interviews with personalized questions, structured sessions, and topic-focused learning.

🌐 **Live App:** [https://prepxpert-frontend.onrender.com](https://prepxpert-frontend.onrender.com)

---

## 🚀 Features

- 🧠 AI-Powered Interview Question Generator
- 🗂️ Session-based learning journeys
- 🧩 Topic & Role Specific Question Sets
- 🔍 Pin & Expand Detailed Explanations
- 📝 Markdown-style Answers with Code
- 🔐 Clerk Authentication (Google OAuth)
- 🎯 Clean, responsive UI (mobile + desktop)

---

## 🛠️ Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React, Tailwind CSS, Vite     |
| Backend   | Node.js, Express              |
| Auth      | Clerk.dev                     |
| Database  | MongoDB + Mongoose            |
| AI        | Google Gemini via Generative SDK |
| Hosting   | Render (Frontend & Backend)   |

---

## 🧪 Local Development

> Prerequisites: **Node.js**, **MongoDB**, and a Clerk + Google Generative AI account.

```bash
# 1. Clone the repo
git clone https://github.com/swaraj017/PrepXpert.git
cd PrepXpert

# 2. Setup Backend
cd backend
npm install
cp .env.example .env    # then configure your API keys, DB URI, etc.
npm run dev             # Backend runs on http://localhost:5000

# 3. Setup Frontend
cd ../frontend
npm install
npm run dev             # Frontend runs on http://localhost:5173
