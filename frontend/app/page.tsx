"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export default function Home() {
  const [lines, setLines] = useState<string[]>([
    "welcome to my portfolio terminal 🚀",
    "type 'help' to get started",
  ]);
  const [input, setInput] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);

  // timer updater 
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formattedTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // terminal commands
  const handleCommand = (cmd: string) => {
    let newLines: string[] = [];

    switch (cmd.toLowerCase()) {
      case "help":
        newLines = [
          "available commands:",
          "about      — who i am",
          "education  — my academics",
          "projects   — my work",
          "skills     — what i use",
          "contact    — connect with me",
          "clear      — clear the terminal",
        ];
        break;
      case "about":
        newLines = [
          "about me:",
          "i’m mayank soni, an electrical engineering student at iit jodhpur.",
          "i love building full-stack and embedded projects.",
        ];
        break;
      case "education":
        newLines = [
          "education:",
          "your education",
        ];
        break;
      case "projects":
        newLines = [
          "projects:",
          "your projects",
        ];
        break;
      case "skills":
        newLines = [
          "skills:",
          "your skills",
        ];
        break;
      case "contact":
        newLines = [
          "contact me:",
          "your contacts",
        ];
        break;
      case "clear":
        setLines([]);
        return;
      default:
        newLines = [`command not found: ${cmd}`];
        break;
    }

    setLines((prev) => [...prev, `> ${cmd}`, ...newLines]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input.trim());
    setInput("");
  };

  // chatbot
  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = { role: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: chatInput }),
      });

      const data = await response.json();
      const botReply = data.message || "Sorry, I didn’t get that.";
      setChatMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error connecting to chatbot API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="flex items-center justify-center h-screen text-green-400 font-mono"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, #2c5364, transparent 60%), radial-gradient(circle at 80% 80%, #203a43, transparent 60%), #0f2027",
      }}
    >
      {/* 💻 Terminal */}
      <div
        className="w-11/12 max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-700 backdrop-blur-2xl animate-fade-in"
        style={{
          background: "rgba(15, 15, 15, 0.6)",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0.5px rgba(255,255,255,0.1)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <p className="ml-3 text-gray-400 text-sm">terminal — bash</p>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">{currentTime}</p>
        </div>

        <div className="p-4 h-[400px] overflow-y-auto whitespace-pre-wrap">
          {lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          <form onSubmit={handleSubmit} className="flex mt-1">
            <span className="mr-2">{">"}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent outline-none flex-1 text-green-400 caret-green-400"
              autoFocus
            />
          </form>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm space-x-4 pb-3">
          <a href="mailto:youraddress@example.com" className="hover:text-green-400">email</a>
          <span>|</span>
          <a href="https://linkedin.com/in/yourUserName" className="hover:text-green-400">linkedin</a>
          <span>|</span>
          <a href="https://github.com/yourUserName" className="hover:text-green-400">github</a>
          <span>|</span>
          <a href="your resources link (if any, otherwise remove this section)" className="hover:text-green-400">resources</a>
        </div>
      </div>

      {/* 💬 Floating Chatbot Button */}
      <button
        onClick={() => setChatbotOpen(!chatbotOpen)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-400 text-black rounded-full p-3 shadow-lg transition-all duration-200"
      >
        {chatbotOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* 🪄 Chatbot Box */}
      {chatbotOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-gray-900 border border-gray-700 rounded-xl shadow-xl flex flex-col overflow-hidden">
          <div className="bg-gray-800 text-green-400 p-2 text-sm font-semibold border-b border-gray-700">
            🤖 chat-bot
          </div>

          {/* Messages */}
          <div className="flex-1 p-2 overflow-y-auto space-y-2 text-sm">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${msg.role === "user"
                  ? "bg-green-700 text-white self-end ml-8"
                  : "bg-gray-800 text-green-400 mr-8"
                  }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-gray-400 text-xs">thinking...</div>}
          </div>

          {/* Input */}
          <div className="border-t border-gray-700 p-2 flex">
            <input
              type="text"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-green-400 text-sm"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="text-green-400 hover:text-green-300 text-sm ml-2"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
