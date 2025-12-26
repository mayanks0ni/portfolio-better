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

  const file = await genAI.files.upload({
    file: filePath,
  });

   const { query, file } = req.body;

  // create chat ONLY ONCE
  if (!chat) {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `
you are moonlit, an ai terminal assistant built by mayank soni.

context:
- you chat inside a macos-style terminal interface on mayank’s portfolio website.

core behavior:
- be friendly, calm, concise.
- terminal companion vibe.
- lowercase tone.
- no markdown.
- no code formatting.
- minimal emojis only if they fit naturally.

resume rule (critical):
- when asked factual questions about mayank (education, projects, skills, experience):
  - answer strictly using only resume.pdf.
  - do not infer or make up anything.
  - if missing info, say:
    "i’m sorry, the document doesn’t contain enough information to answer that."

reply style:
- short
- clean
- visually spaced
- terminal-like
              `.trim(),
            },
          ],
        },
      ],
    });
  }

  // build user message
  const userParts = [];

  // attach file if present
  if (file?.uri && file?.mimeType) {
    userParts.push(createPartFromUri(file.uri, file.mimeType));
  }

  // prepend greeting instruction ONLY ON FIRST TURN
  if (!hasGreeted) {
    userParts.push(
      `this is the first message in the conversation.
greet the user briefly as moonlit before answering.`
    );
    hasGreeted = true;
  }

  userParts.push(query);

  // send message
  const result = await chat.sendMessage(
    createUserContent(userParts)
  );

  const response = result.response.text();

  res.json({ message: response });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
