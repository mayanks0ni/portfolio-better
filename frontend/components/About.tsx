"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GraduationCap, Terminal, Code2 } from "lucide-react";
import { SKILL_GROUPS, PERSONAL_INFO } from "../data/portfolio-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".about-fade-in",
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

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)] lowercase"
    >
      {/* Section Header */}
      <div className="about-fade-in flex items-center gap-3 text-xs font-mono text-[var(--foreground-secondary)] tracking-wider mb-4">
        <span className="text-[var(--accent-lime)]">02</span>
        <span className="w-8 h-[1px] bg-[var(--border-subtle)]" />
        <span>about &amp; technical strengths</span>
      </div>

      <div className="about-fade-in max-w-3xl mb-12">
        <h2 className="text-3xl sm:text-5xl font-editorial italic font-normal text-[var(--foreground)] tracking-tight leading-tight">
          rigorous engineering foundations meeting the precision of digital craft.
        </h2>
        <p className="mt-5 text-[var(--foreground-secondary)] text-base sm:text-lg leading-relaxed font-sans font-light">
          {PERSONAL_INFO.bio}
        </p>
      </div>

      {/* Academic Note & Philosophy */}
      <div className="about-fade-in grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="glass-panel rounded-2xl p-5 border border-[var(--border-subtle)] flex items-start gap-4 bg-[var(--surface)]">
          <div className="w-9 h-9 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-lime)] shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                electrical engineering student
              </h3>
              <span className="text-[10px] font-mono text-[var(--accent-lime)] bg-[var(--accent-lime)]/10 px-2 py-0.5 rounded-full border border-[var(--accent-lime)]/20">
                iit jodhpur
              </span>
            </div>
            <p className="text-xs text-[var(--foreground-secondary)] font-mono mt-1">
              class of 2028 • jodhpur, india
            </p>
            <p className="text-xs text-[var(--foreground-secondary)] mt-2 leading-relaxed">
              pursuing foundational electrical and computational engineering while architecting concurrent software systems and research data planes.
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-[var(--border-subtle)] flex items-start gap-4 bg-[var(--surface)]">
          <div className="w-9 h-9 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-blue)] shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              systems &amp; design ethos
            </h3>
            <p className="text-xs text-[var(--foreground-secondary)] font-mono mt-1">
              concurrency • ai guardrails • editorial ui
            </p>
            <p className="text-xs text-[var(--foreground-secondary)] mt-2 leading-relaxed">
              bridging asynchronous low-level pipelines with refined typographic craft, ensuring computational depth never compromises aesthetic excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Redesigned Compact Technology Stack — Text-Based Editorial Spec Sheet */}
      <div className="about-fade-in glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--border-subtle)] shadow-xl bg-[var(--surface)]">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-6">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-4 h-4 text-[var(--accent-lime)]" />
            <h3 className="text-xs font-mono font-semibold text-[var(--foreground)] tracking-wider">
              compact technology stack
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[var(--foreground-secondary)]">
            specifications / core &amp; applied
          </span>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.id}
              className="py-3.5 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-baseline group"
            >
              {/* Category Label */}
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="text-[10px] font-mono text-[var(--accent-lime)]">
                  {group.label}
                </span>
                <span className="text-xs font-mono font-medium text-[var(--foreground)] tracking-tight">
                  {group.name}
                </span>
              </div>

              {/* Inline Bullet-Separated Items */}
              <div className="md:col-span-9 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs font-sans text-[var(--foreground-secondary)]">
                {group.items.map((item, idx) => (
                  <span key={item.name} className="inline-flex items-center gap-2">
                    <span
                      title={item.context}
                      className={`hover:text-[var(--accent-lime)] transition-colors cursor-default ${
                        item.highlight ? "text-[var(--foreground)] font-medium" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                    {idx < group.items.length - 1 && (
                      <span className="text-[var(--border-subtle)] text-[10px]">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
