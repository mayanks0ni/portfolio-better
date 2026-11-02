"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X, Sun, Moon } from "lucide-react";
import { SOCIAL_LINKS } from "../data/portfolio-data";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const handleBrandClick = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(SOCIAL_LINKS.discord);
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2200);
    }
  };

  useEffect(() => {
    setMounted(true);
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    setIsDark(isCurrentlyDark);
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", nextTheme);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "projects", "beyond", "contact"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live Jodhpur / IST clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: "overview", href: "#hero", id: "hero" },
    { label: "about & skills", href: "#about", id: "about" },
    { label: "selected work", href: "#projects", id: "projects" },
    { label: "archive & life", href: "#beyond", id: "beyond" },
    { label: "contact", href: "#contact", id: "contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Expandable Discord Circular Tab */}
        <a
          href="#hero"
          onClick={handleBrandClick}
          className="group relative flex items-center h-10 rounded-full glass-panel border border-[var(--border-subtle)] hover:border-[var(--accent-lime)]/50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-sm hover:shadow-lg overflow-hidden max-w-[40px] hover:max-w-[175px] p-1 shrink-0"
          title={`discord: @${SOCIAL_LINKS.discord} (click to copy)`}
          aria-label={`discord profile: @${SOCIAL_LINKS.discord}`}
        >
          {/* Discord PFP (Perfect Circle, Fixed Position) */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[var(--surface-elevated)] border border-[var(--border-subtle)] group-hover:border-[var(--accent-lime)] transition-colors">
            <Image
              src={SOCIAL_LINKS.discordAvatar || "/discord-avatar.png"}
              alt={`${SOCIAL_LINKS.discord} discord pfp`}
              width={32}
              height={32}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
            {/* Online Pulse Dot */}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[var(--accent-lime)] ring-[1.5px] ring-[var(--surface-elevated)] shadow-[0_0_6px_var(--accent-lime)] animate-pulse" />
          </div>

          {/* Revealable Username Text (Smooth Expansion on Hover) */}
          <div className="flex items-center overflow-hidden whitespace-nowrap pl-0 group-hover:pl-2.5 group-hover:pr-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100">
            <span className="text-xs font-mono font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent-lime)] transition-colors lowercase">
              {copiedDiscord ? "handle copied!" : `@${SOCIAL_LINKS.discord}`}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Pill (Locked dead-center) */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full glass-panel border border-[var(--border-subtle)] shadow-lg absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-200 lowercase ${
                  isActive
                    ? "text-[var(--accent-lime-text)] bg-[var(--accent-lime)] font-semibold shadow-[0_0_15px_-3px_rgba(243,183,62,0.4)]"
                    : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right Info Pill & Theme Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Switcher Button */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn p-2 rounded-full glass-panel text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:border-[var(--accent-lime)] border border-[var(--border-subtle)] transition-all duration-300 shadow-sm flex items-center justify-center group"
              aria-label={`switch to ${isDark ? "light" : "dark"} mode`}
              title={`switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[var(--accent-amber)] group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--accent-blue)] group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>
          )}

          {/* Jodhpur Clock Pill */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-panel text-[11px] font-mono text-[var(--foreground-secondary)] border border-[var(--border-subtle)]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-lime)] shadow-[0_0_8px_var(--accent-lime)] animate-pulse" />
            <span className="lowercase">jodhpur {currentTime || "ist"}</span>
          </div>

          <a
            href="#contact"
            className="hidden sm:flex group px-4 py-1.5 rounded-full text-xs font-medium text-[var(--foreground)] glass-panel border border-[var(--border-subtle)] items-center gap-1.5 hover:border-[var(--accent-lime)] hover:text-[var(--accent-lime)] transition-all duration-200 lowercase"
          >
            <span>connect</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden glass-panel p-2 rounded-full text-[var(--foreground)] hover:text-[var(--accent-lime)] border border-[var(--border-subtle)]"
            aria-label="toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 max-w-sm mx-auto glass-panel rounded-2xl p-4 shadow-2xl border border-[var(--border-subtle)] animate-fade-in bg-[var(--surface)]/95">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors lowercase ${
                  activeSection === item.id
                    ? "bg-[var(--accent-lime)] text-[var(--accent-lime-text)] font-semibold"
                    : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 mt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--foreground-secondary)]">
              <span className="lowercase">jodhpur {currentTime || "ist"}</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] text-[var(--foreground)]"
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isDark ? "light mode" : "dark mode"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
