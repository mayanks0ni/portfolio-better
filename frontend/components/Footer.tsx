"use client";

import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-8 px-4 sm:px-8 border-t border-[var(--border-subtle)] bg-[var(--background)] lowercase">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-mono text-[var(--foreground-secondary)]">
        <span>&copy; {new Date().getFullYear()} mayank soni</span>

        <button
          onClick={scrollToTop}
          className="p-2 rounded-full glass-panel hover:border-[var(--accent-lime)] text-[var(--foreground-secondary)] hover:text-[var(--accent-lime)] border border-[var(--border-subtle)] transition-colors flex items-center gap-1.5"
          title="return to top"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden sm:inline">top</span>
        </button>
      </div>
    </footer>
  );
}
