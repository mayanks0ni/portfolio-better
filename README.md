# 🧠 Moonlit Portfolio — Interactive Terminal Portfolio

Welcome to **Moonlit Portfolio**, an interactive terminal-themed portfolio built with **Next.js (frontend)** and **Express.js (backend)**.  
It features a built-in AI chatbot named **Moonlit** that answers questions **based only on your resume.pdf**, creating a personalized and engaging experience.

---

## 🌟 Features

- Terminal-style interface with command-based navigation  
- Real-time clock and interactive terminal UI  
- Built-in **AI Chatbot (Moonlit)** that:
  - Reads information directly from your `resume.pdf`
  - Replies politely and conversationally in a simple, terminal-style format
  - Avoids any information not contained in the resume
- Fully customizable for your own personal portfolio

---

## 🧩 Project Structure

```
📦 project-root
├── frontend/                 # Next.js portfolio frontend
│   ├── app/                  # Main app pages and components
│   ├── public/               # Public assets
│   └── ...                   
│
├── backend/                  # Express.js backend server
│   ├── imp/                  # Important files
│   │   └── resume.pdf        # ✅ Place your resume here
│   ├── server.js             # Express + Gemini API setup
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

---

### 2️⃣ Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file (optional) to store your Gemini API key:

```
API_KEY=your_gemini_api_key
```

Or directly set it in `server.js`:

```js
const apikey = "your_gemini_api_key";
```

Now, **add your resume** (PDF file) at this location:

```
backend/imp/resume.pdf
```

✅ The chatbot will use only this file to answer user questions.

Start the backend server:

```bash
npm start
```

> The backend will start on:  
> 🔗 `http://localhost:5000` (or whichever port you configure)

---

### 3️⃣ Frontend Setup

Open a new terminal window and navigate to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

This starts the Next.js frontend app at:

```
http://localhost:3000
```

The frontend connects automatically to your backend’s `/api/chatbot` route for the chat functionality.

---

## 🤖 Chatbot Behavior

The chatbot **Moonlit** is powered by the Gemini API.  
It uses a system prompt that ensures:

- Responses are polite, concise, and lowercase.  
- It only uses information found in your `resume.pdf`.  
- If missing data, it responds with:  
  > "i'm sorry, the document doesn’t contain enough information to answer that."

You can modify the prompt inside `server.js` under the `/api/chatbot` route to change tone or behavior.

---

## 🧠 Terminal Commands

Inside the portfolio, users can type commands such as:

| Command     | Description                         |
|--------------|-------------------------------------|
| `help`       | Show all available commands         |
| `about`      | About the portfolio owner           |
| `education`  | Educational background              |
| `projects`   | Show recent projects                |
| `skills`     | Show technologies used              |
| `contact`    | Show contact links                  |
| `clear`      | Clear the terminal                  |

---

## 💬 Example Chatbot Usage

**You:** hi  
**Moonlit:**  
```
hello there 👋  
i’m moonlit, your terminal companion.  
how can i assist you today?
```

**You:** tell me about your education  
**Moonlit:**  
```
based on your resume:  
- b.tech in electrical engineering, iit jodhpur (2024–2028)  
- cgpa: 7.58 / 10  
- relevant coursework: calculus, electrical engineering, computer science
```

---

## 🧑‍💻 Customization for Your Own Portfolio

1. Replace all mentions of “Mayank Soni” in both frontend and backend.  
2. Add your own **resume.pdf** inside `backend/imp/`.  
3. Modify terminal commands in `frontend/app/page.tsx` as desired.  
4. Update the chatbot system prompt in `server.js` to personalize tone or name.  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend:** Express.js, Gemini API (`@google/genai`)  
- **Language:** JavaScript (with optional TypeScript support)

---

## 🚀 Deployment

You can deploy easily using:

- **Frontend:** [Vercel](https://vercel.com/)  
- **Backend:** [Render](https://render.com/), [Railway](https://railway.app/), or [Heroku](https://www.heroku.com/)  

Make sure to update your frontend’s API endpoint to point to your deployed backend URL.

---

## ✨ Author

**Mayank Soni**  
📧 [mayanks86027@gmail.com](mailto:mayanks86027@gmail.com)  
🔗 [linkedin.com/in/mayanks0ni](https://linkedin.com/in/mayanks0ni)  
💻 [github.com/mayanks0ni](https://github.com/mayanks0ni)
