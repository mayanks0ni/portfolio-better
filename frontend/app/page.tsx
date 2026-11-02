"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import BeyondTheBuild from "../components/BeyondTheBuild";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import MoonlitTerminalModal from "../components/MoonlitTerminalModal";
import { Terminal } from "lucide-react";

export default function Home() {
  const [moonlitOpen, setMoonlitOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent-lime)] selection:text-[var(--accent-lime-text)] relative lowercase transition-colors duration-300">
      {/* Floating Navigation with Theme Switcher */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Section 01: Hero / Introduction & Live Spotify Telemetry */}
        <Hero />

        {/* Section 02: About / Compact Technology Stack & Research */}
        <About />

        {/* Section 03: Selected Work & Engineered Systems */}
        <Projects />

        {/* Section 04: Beyond the Build (Anime Dossier, Discord, Dynamic Collection Archive) */}
        <BeyondTheBuild />

        {/* Section 05: Contact & Initiation */}
        <Contact />
      </main>

      {/* Minimalist Colophon Footer */}
      <Footer />

      {/* Floating Moonlit Terminal Companion Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setMoonlitOpen(true)}
          className="group glass-panel hover:border-[var(--accent-lime)] p-2.5 rounded-full shadow-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 border border-[var(--border-subtle)] bg-[var(--surface)]/90 backdrop-blur-md"
          title="open moonlit terminal companion"
          aria-label="open moonlit terminal companion"
        >
          <div className="w-6 h-6 rounded-full bg-[var(--surface-elevated)] text-[var(--accent-lime)] border border-[var(--border-subtle)] flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)] font-medium pr-1.5 hidden md:inline transition-colors">
            moonlit companion
          </span>
        </button>
      </div>

      {/* Moonlit Terminal Modal */}
      <MoonlitTerminalModal
        isOpen={moonlitOpen}
        onClose={() => setMoonlitOpen(false)}
      />
    </div>
  );
}
