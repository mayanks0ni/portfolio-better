"use client";

import { useState, useEffect, useRef } from "react";
import { X, CornerDownLeft } from "lucide-react";
import { SOCIAL_LINKS, PROJECTS } from "../data/portfolio-data";

interface MoonlitTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MoonlitTerminalModal({ isOpen, onClose }: MoonlitTerminalModalProps) {
  const [lines, setLines] = useState<string[]>([
    "moonlit terminal companion [v3.0 — atelier edition]",
    "connected to mayank soni's knowledge graph",
    "type 'help' for commands, or ask any question to chat with moonlit.",
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, isOpen]);

  if (!isOpen) return null;

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();

    // Standard commands
    if (lower === "help") {
      setLines((prev) => [
        ...prev,
        `> ${trimmed.toLowerCase()}`,
        "available commands:",
        "  about      — educational and research background",
        "  projects   — major systems and engineering repositories",
        "  skills     — core languages, frameworks and infrastructure",
        "  contact    — verified communication channels",
        "  clear      — clear terminal output",
        "or ask any question: e.g. 'what is dit pruning?', 'explain cascade'",
      ]);
      return;
    }

    if (lower === "clear") {
      setLines([]);
      return;
    }

    if (lower === "about") {
      setLines((prev) => [
        ...prev,
        `> ${trimmed.toLowerCase()}`,
        `mayank soni — software engineer & deep learning researcher.`,
        `specializing in diffusion transformer structural pruning, c++ graph algorithms, and full-stack ai applications.`,
      ]);
      return;
    }

    if (lower === "projects") {
      setLines((prev) => [
        ...prev,
        `> ${trimmed.toLowerCase()}`,
        "featured systems:",
        ...PROJECTS.map((p) => `• ${p.title.padEnd(16)} — ${p.tagline}`),
      ]);
      return;
    }

    if (lower === "skills") {
      setLines((prev) => [
        ...prev,
        `> ${trimmed.toLowerCase()}`,
        "core proficiencies:",
        "• languages: python, typescript, c/c++, javascript, sql",
        "• deep learning & vision: pytorch, dit-xl/2, movement pruning",
        "• systems & algorithms: c++17, dijkstra min-heap, osm graph analysis",
        "• web & full-stack: next.js 15, react 19, tailwind css, firebase, gemini",
      ]);
      return;
    }

    if (lower === "contact") {
      setLines((prev) => [
        ...prev,
        `> ${trimmed.toLowerCase()}`,
        `email:    ${SOCIAL_LINKS.email}`,
        `github:   ${SOCIAL_LINKS.github}`,
        `linkedin: ${SOCIAL_LINKS.linkedin}`,
        `discord:  @${SOCIAL_LINKS.discord}`,
        `x:        ${SOCIAL_LINKS.x}`,
        `reddit:   ${SOCIAL_LINKS.reddit}`,
      ]);
      return;
    }

    // Otherwise, dispatch to Moonlit AI backend
    setLines((prev) => [...prev, `> ${trimmed.toLowerCase()}`, "moonlit is thinking..."]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = (data.message || "i didn't catch that. try asking about mayank's projects or engineering work.").toLowerCase();
        setLines((prev) => [...prev.slice(0, -1), reply]);
      } else {
        throw new Error("api error");
      }
    } catch {
      // Intelligent fallback answer without exposing private data
      setLines((prev) => [
        ...prev.slice(0, -1),
        `moonlit: mayank is a software engineer researching diffusion transformer structural pruning (dit-xl/2), micro-learning platforms (cascade), and c++ graph pathfinding (ev route optimization system). reach him at ${SOCIAL_LINKS.email}.`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const cmd = input;
    setInput("");
    handleCommand(cmd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md lowercase">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--foreground)] font-mono text-xs max-h-[85vh] flex flex-col">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-lime)] shadow-[0_0_8px_var(--accent-lime)]" />
            <span className="font-semibold text-[var(--foreground)] tracking-tight">
              moonlit companion terminal
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--foreground)]/10 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
            aria-label="close terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Output Log */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2 min-h-[260px] text-[11px] leading-relaxed">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`${
                line.startsWith(">")
                  ? "text-[var(--accent-lime)] font-semibold"
                  : line.startsWith("•")
                  ? "text-[var(--foreground)] pl-2"
                  : "text-[var(--foreground-secondary)]"
              }`}
            >
              {line}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="pt-3 border-t border-[var(--border-subtle)] flex items-center gap-2"
        >
          <span className="text-[var(--accent-lime)] font-bold">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type 'help', 'about', 'projects', or ask anything..."
            className="flex-1 bg-transparent border-none outline-none text-[var(--foreground)] placeholder-[var(--foreground-muted)] text-xs font-mono"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-1.5 rounded-lg bg-[var(--accent-lime)] text-[var(--accent-lime-text)] hover:opacity-90 disabled:opacity-40 transition-opacity"
            aria-label="submit command"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
