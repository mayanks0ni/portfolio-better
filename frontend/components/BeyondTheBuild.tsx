"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimeCard from "./AnimeCard";
import DiscordCard from "./DiscordCard";
import VisualArchive from "./VisualArchive";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function BeyondTheBuild() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".beyond-fade-in",
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
      id="beyond"
      ref={containerRef}
      className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)] lowercase"
    >
      {/* Section Header */}
      <div className="beyond-fade-in flex items-center gap-3 text-xs font-mono text-[var(--foreground-secondary)] tracking-wider mb-4">
        <span className="text-[var(--accent-lime)]">04</span>
        <span className="w-8 h-[1px] bg-[var(--border-subtle)]" />
        <span>archive &amp; personal intermission</span>
      </div>

      <div className="beyond-fade-in max-w-3xl mb-12">
        <h2 className="text-3xl sm:text-5xl font-editorial italic font-normal text-[var(--foreground)] tracking-tight leading-tight">
          storytelling, anime narratives, visual craft &amp; digital identity.
        </h2>
        <p className="mt-5 text-[var(--foreground-secondary)] text-base sm:text-lg leading-relaxed font-sans font-light">
          a dedicated creative space beyond systems engineering. here are the anime narratives i follow, direct communication channels, and dynamically discovered visual designs.
        </p>
      </div>

      {/* Grid: Anime Dossier & Discord Identity */}
      <div className="beyond-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimeCard />
        <DiscordCard />
      </div>

      {/* Dynamic Visual Archive */}
      <div className="beyond-fade-in">
        <VisualArchive />
      </div>
    </section>
  );
}
