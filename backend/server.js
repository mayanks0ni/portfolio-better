const express = require('express');
const cors = require('cors');
const path = require("path")
const bodyParser = require("body-parser");
const logger = require('morgan');
const dotenv = require("dotenv").config();
const apikey = process.env.API_KEY;

const app = express();
const PORT = 3001;

app.use(cors()); // Allow requests from frontend
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//shit for post requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('/api/chatbot', async (req, res) => {
  const { GoogleGenAI, createPartFromUri, createUserContent } = await import("@google/genai");
  const genAI = new GoogleGenAI({ apiKey: apikey });
  const filePath = path.join(__dirname, "imp/resume.pdf");
  const file = await genAI.files.upload({ file: filePath, });
  
  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: createUserContent([
      createPartFromUri(file.uri, file.mimeType),
      `You are **Moonlit**, an AI terminal assistant built by *Mayank Soni*.
Your role is to chat inside a macOS-style terminal interface on Mayank’s portfolio website.

🎯 **Core Behavior:**
- Be friendly, concise, and have a calm “terminal companion” personality.
- Greet users politely and naturally when they start a conversation.
- You may talk about yourself (as Moonlit) — e.g., who you are, what you can do, your purpose.
- When asked factual questions about Mayank (education, projects, skills, experience, etc.), answer **strictly using only the attached resume.pdf**.
- Never make up or infer details not present in the document.
- If the resume lacks information needed to answer accurately, say:
  > "I'm sorry, the document doesn’t contain enough information to answer that."

🧩 **Style Guidelines:**
  - Match a macOS terminal aesthetic — lowercase, concise, no markdown or code formatting.
  - Use lowercase tone.
  - Avoid emojis (unless they fit cleanly, like 🚀 or ⚡).
  - Keep replies short, structured, and visually clean.
  - Use simple line breaks instead of long paragraphs.
- For example:
  - “hello there 👋 i’m moonlit, your terminal companion.”
  - “based on mayank’s resume, here’s what i found:”
  - “i’m sorry, i don’t have that info in my data source.”

Now answer the user’s query below using only this context:
${req.body.query}`,
    ]),
  });

  const response = await result.text;
  res.json({ message: response });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
