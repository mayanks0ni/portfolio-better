"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Github,
  Linkedin,
  MessageSquare,
  Copy,
  Check,
  ArrowUpRight,
  Send,
  Compass,
} from "lucide-react";
import { PERSONAL_INFO, SOCIAL_LINKS } from "../data/portfolio-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".contact-fade-in",
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SOCIAL_LINKS.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="py-20 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)] lowercase"
    >
      {/* Section Header */}
      <div className="contact-fade-in flex items-center gap-3 text-xs font-mono text-[var(--foreground-secondary)] mb-6">
        <span className="text-[var(--accent-lime)]">05</span>
        <span className="w-8 h-[1px] bg-[var(--border-subtle)]" />
        <span>initiate collaboration</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Big Statement & Narrative */}
        <div className="contact-fade-in lg:col-span-7">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-editorial italic font-normal text-[var(--foreground)] tracking-tight leading-[1.08]">
            let&apos;s build something <span className="text-[var(--accent-lime)] not-italic font-sans font-medium">exceptional</span> together.
          </h2>

          <p className="mt-8 text-base sm:text-lg text-[var(--foreground-secondary)] leading-relaxed font-sans font-light max-w-xl">
            i am currently <strong className="text-[var(--foreground)] font-medium">open to work</strong>, systems engineering challenges, autonomous agent research, and technical collaboration.
          </p>

          <p className="mt-4 text-xs sm:text-sm text-[var(--foreground-muted)] font-mono leading-relaxed max-w-lg">
            whether you are discussing a distributed systems challenge, ai safety architectures, or creative product direction, my inbox is always open.
          </p>

          {/* Email Copy Box */}
          <div className="mt-10 p-5 rounded-3xl glass-panel border border-[var(--border-subtle)] shadow-xl max-w-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--surface)]">
            <div>
              <span className="text-[10px] font-mono text-[var(--foreground-secondary)] block">
                direct email inquiries
              </span>
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="text-base sm:text-lg font-mono font-semibold text-[var(--foreground)] hover:text-[var(--accent-lime)] transition-colors"
              >
                {SOCIAL_LINKS.email}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyEmail}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  copiedEmail
                    ? "bg-[var(--accent-lime)] text-[var(--accent-lime-text)] shadow-[0_0_12px_rgba(243,183,62,0.4)]"
                    : "bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--border-subtle)] hover:border-[var(--accent-lime)]"
                }`}
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
                    <span>copy</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${SOCIAL_LINKS.email}?subject=engineering%20inquiry%20via%20portfolio`}
                className="px-4 py-2 rounded-xl bg-[var(--accent-lime)] text-[var(--accent-lime-text)] text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-[0_0_15px_-3px_rgba(243,183,62,0.35)]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>compose</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Social Channels */}
        <div className="contact-fade-in lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--border-subtle)] shadow-xl bg-[var(--surface)]">
            <h3 className="text-xs font-mono text-[var(--foreground-secondary)] mb-5">
              verified profiles &amp; channels
            </h3>

            <div className="space-y-3">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3.5 rounded-2xl bg-[var(--surface-elevated)] hover:border-[var(--accent-lime)] border border-[var(--border-subtle)] flex items-center justify-between transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--background)] text-[var(--foreground)] border border-[var(--border-subtle)] flex items-center justify-center">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[var(--foreground)] font-sans block group-hover:text-[var(--accent-lime)] transition-colors">
                      github
                    </span>
                    <span className="text-[11px] font-mono text-[var(--foreground-secondary)]">
                      github.com/mayanks0ni
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--foreground-secondary)] group-hover:text-[var(--accent-lime)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </a>

              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3.5 rounded-2xl bg-[var(--surface-elevated)] hover:border-[var(--accent-blue)] border border-[var(--border-subtle)] flex items-center justify-between transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[var(--foreground)] font-sans block group-hover:text-[var(--accent-blue)] transition-colors">
                      linkedin
                    </span>
                    <span className="text-[11px] font-mono text-[var(--foreground-secondary)]">
                      linkedin.com/in/mayanks0ni
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--foreground-secondary)] group-hover:text-[var(--accent-blue)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </a>

              <div className="p-3.5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#5865F2] text-white flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[var(--foreground)] font-sans block">
                      discord
                    </span>
                    <span className="text-[11px] font-mono text-[var(--foreground-secondary)]">
                      @{SOCIAL_LINKS.discord}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[var(--accent-lime)] bg-[var(--accent-lime)]/15 px-2 py-0.5 rounded border border-[var(--accent-lime)]/30 font-semibold">
                  open
                </span>
              </div>
            </div>

            {/* Location & Availability Seal */}
            <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--foreground-secondary)]">
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
              <span className="text-[var(--accent-lime)] font-medium">available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
