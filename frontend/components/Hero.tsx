"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Prism from "./Prism";
import {
  ArrowDown,
  ArrowUpRight,
  Compass,
  Terminal,
  Music,
  ExternalLink,
  Disc,
  Clock,
  Code2,
} from "lucide-react";
import { PERSONAL_INFO } from "../data/portfolio-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  playedAt?: string;
  isConfigured: boolean;
}

interface PresenceData {
  isCoding: boolean;
  editor: "antigravity" | "vs code" | null;
  editorDisplay: string;
  language: string | null;
  extension: string | null;
  phrase: string;
  status: "active" | "idle" | "offline";
  statusText: string;
  sessionStartedAt?: string;
  updatedAt: string;
}

function AntigravityIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-label="antigravity ide">
      <defs>
        <radialGradient id="agGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-lime)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--accent-lime)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="8" fill="url(#agGlow)" opacity="0.3" />
      <ellipse cx="24" cy="24" rx="20" ry="8" stroke="var(--accent-lime)" strokeWidth="2" strokeDasharray="3 3" transform="rotate(-30 24 24)" opacity="0.8" />
      <ellipse cx="24" cy="24" rx="20" ry="8" stroke="currentColor" strokeWidth="1.8" transform="rotate(30 24 24)" opacity="0.65" />
      <circle cx="24" cy="24" r="5" fill="var(--accent-lime)" />
      <circle cx="24" cy="24" r="2.5" fill="var(--background)" />
    </svg>
  );
}

function VSCodeIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="visual studio code">
      <path
        d="M17.5 2.5L7.5 10.5L3 7L1.5 8.2L5 12L1.5 15.8L3 17L7.5 13.5L17.5 21.5L22.5 19V5L17.5 2.5ZM17.5 16.5L10 12L17.5 7.5V16.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const specCardRef = useRef<HTMLDivElement>(null);

  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [spotifyLoading, setSpotifyLoading] = useState(true);

  const [presenceData, setPresenceData] = useState<PresenceData | null>(null);
  const [presenceLoading, setPresenceLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(!document.documentElement.classList.contains("light"));
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchSpotify() {
      try {
        const res = await fetch("/api/spotify");
        if (res.ok) {
          const json = await res.json();
          setSpotifyData(json);
        }
      } catch (err) {
        console.error("failed to load spotify telemetry:", err);
      } finally {
        setSpotifyLoading(false);
      }
    }

    fetchSpotify();
    const interval = setInterval(fetchSpotify, 25000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchPresence() {
      try {
        const res = await fetch("/api/presence");
        if (res.ok) {
          const json = await res.json();
          setPresenceData(json);
        }
      } catch (err) {
        console.error("failed to load presence telemetry:", err);
      } finally {
        setPresenceLoading(false);
      }
    }

    fetchPresence();
    const interval = setInterval(fetchPresence, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!presenceData?.isCoding || !presenceData?.sessionStartedAt) {
      setElapsedTime("00:00:00");
      return;
    }

    const start = new Date(presenceData.sessionStartedAt).getTime();

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((Date.now() - start) / 1000));
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setElapsedTime(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [presenceData?.isCoding, presenceData?.sessionStartedAt]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(badgeRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.8,
        })
          .from(
            ".hero-title-line",
            {
              y: 40,
              opacity: 0,
              duration: 1,
              stagger: 0.15,
            },
            "-=0.5"
          )
          .from(
            narrativeRef.current,
            {
              y: 25,
              opacity: 0,
              duration: 0.8,
            },
            "-=0.6"
          )
          .from(
            specCardRef.current,
            {
              y: 35,
              opacity: 0,
              duration: 0.9,
            },
            "-=0.6"
          )
          .from(
            ".hero-cta-btn",
            {
              y: 15,
              opacity: 0,
              duration: 0.6,
              stagger: 0.1,
              clearProps: "all",
            },
            "-=0.5"
          );
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-[94vh] flex flex-col justify-center overflow-hidden lowercase isolate"
    >
      {/* Prism 3D Interactive Background - Full Width Edge to Edge */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <Prism
          animationType="3drotate"
          timeScale={0.1}
          height={1.3}
          baseWidth={6.9}
          scale={4.5}
          hueShift={0}
          colorFrequency={1}
          glow={0.55}
          saturation={1.45}
          hoverStrength={1.1}
          inertia={0.09}
          lightMode={!isDark}
        />
      </div>

      {/* Inner Content Container Constrained to 7xl Grid */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-32 sm:pt-40 pb-20 flex flex-col justify-center">
        {/* Dimensional Ambient Lighting (Subtle, Atmospheric, Non-flat) */}
        <div className="absolute top-1/4 -left-36 w-[420px] h-[420px] rounded-full bg-[var(--accent-blue)]/10 blur-[130px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-0 w-[480px] h-[480px] rounded-full bg-[var(--accent-lime)]/[0.07] blur-[150px] pointer-events-none -z-10" />
        <div className="absolute -bottom-20 left-1/3 w-[380px] h-[380px] rounded-full bg-[var(--accent-violet)]/[0.06] blur-[120px] pointer-events-none -z-10" />

        {/* Top Technical Annotation Badge */}
        <div ref={badgeRef} className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
          <div className="glass-panel px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono text-[var(--foreground-secondary)] border border-[var(--border-subtle)] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-lime)] shadow-[0_0_8px_var(--accent-lime)] inline-block animate-pulse" />
            <span className="font-semibold text-[var(--foreground)] tracking-tight">software engineer</span>
            <span className="text-[var(--border-subtle)]">/</span>
            <span>and i watch anime</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-[var(--foreground-secondary)] bg-[var(--surface)] border border-[var(--border-subtle)]">
            <Compass className="w-3 h-3 text-[var(--accent-lime)]" />
            <span>{PERSONAL_INFO.coordinates}</span>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left Column: Title & Editorial Narrative */}
          <div className="lg:col-span-7 flex flex-col">
            <h1
              ref={titleRef}
              className="text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[var(--foreground)] font-normal leading-[1.03]"
            >
              <span className="block hero-title-line font-editorial italic font-normal text-[var(--foreground)]">
                mayank
              </span>
              <span className="block hero-title-line font-sans font-medium tracking-tighter text-[var(--foreground)]">
                soni<span className="text-[var(--accent-lime)]">.</span>
              </span>
            </h1>

            <div ref={narrativeRef} className="mt-8 space-y-6 max-w-xl">
              <p className="text-lg sm:text-xl text-[var(--foreground)] font-sans leading-relaxed font-light">
                software engineer &amp; creative technologist focusing on{" "}
                <strong className="font-medium text-[var(--accent-lime)]">high-concurrency systems</strong>, reinforcement learning data planes, and autonomous agent safety guardrails.
              </p>

              <p className="text-sm sm:text-base text-[var(--foreground-secondary)] leading-relaxed font-sans">
                operating at the intersection of low-level computational logic and contemporary digital atelier design — transforming complex engineering constraints into reliable, art-directed software.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#projects"
                  className="hero-cta-btn group px-6 py-3 rounded-full bg-[var(--accent-lime)] text-[var(--accent-lime-text)] font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all duration-300 shadow-[0_0_24px_-4px_rgba(243,183,62,0.4)]"
                >
                  <span>explore selected work</span>
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
                </a>

                <a
                  href="#contact"
                  className="hero-cta-btn group px-5 py-3 rounded-full glass-panel text-[var(--foreground)] font-medium text-sm flex items-center gap-2 border border-[var(--border-subtle)] hover:border-[var(--accent-lime)] hover:text-[var(--accent-lime)] transition-all duration-200"
                >
                  <span>get in touch</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Spotify Music Telemetry & Focus Card */}
          <div ref={specCardRef} className="lg:col-span-5 flex flex-col gap-5 justify-start">
            {/* Integrated Spotify Music Telemetry Card */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-xl border border-[var(--border-subtle)] relative subtle-iridescent bg-[var(--surface)]/95">
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[var(--accent-lime)] text-[var(--accent-lime-text)] flex items-center justify-center">
                    <Music className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-xs font-mono font-medium tracking-tight text-[var(--foreground)]">
                    currently listening
                  </span>
                </div>

                {spotifyData?.isPlaying ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--accent-lime)] bg-[var(--accent-lime)]/10 border border-[var(--accent-lime)]/30 px-2.5 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-lime)] animate-pulse" />
                    <span>listening now</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--foreground-secondary)] bg-[var(--surface-elevated)] px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)]">
                    <Clock className="w-3 h-3" />
                    <span>last played</span>
                  </span>
                )}
              </div>

              {/* Track Info */}
              <div className="pt-3.5 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md shrink-0 border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
                  {spotifyData?.albumImageUrl ? (
                    <Image
                      src={spotifyData.albumImageUrl}
                      alt={spotifyData.title || "album art"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--foreground-secondary)]">
                      <Disc className="w-6 h-6 animate-spin" style={{ animationDuration: "6s" }} />
                    </div>
                  )}

                  {/* Animated Equalizer when playing */}
                  {spotifyData?.isPlaying && (
                    <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-xs p-1 rounded flex items-end gap-0.5 h-4 border border-white/10">
                      <span className="w-0.5 bg-[var(--accent-lime)] rounded-full eq-bar-1" />
                      <span className="w-0.5 bg-[var(--accent-lime)] rounded-full eq-bar-2" />
                      <span className="w-0.5 bg-[var(--accent-lime)] rounded-full eq-bar-3" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <a
                    href={spotifyData?.songUrl || "https://open.spotify.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-center gap-1 text-sm sm:text-base font-sans font-semibold text-[var(--foreground)] hover:text-[var(--accent-lime)] transition-colors truncate"
                    title="open on spotify"
                  >
                    <span className="truncate">
                      {spotifyData?.title || (spotifyLoading ? "connecting to spotify..." : "quiet session")}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover/link:opacity-100 shrink-0" />
                  </a>

                  <p className="text-xs font-medium text-[var(--accent-lime)] truncate mt-0.5">
                    {spotifyData?.artist || "mayank soni"}
                  </p>

                  {spotifyData?.album && (
                    <p className="text-[11px] font-mono text-[var(--foreground-secondary)] truncate mt-0.5">
                      {spotifyData.album}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Discord Rich Presence Coding Activity Card */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-xl border border-[var(--border-subtle)] relative subtle-iridescent bg-[var(--surface)]/95">
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[var(--accent-lime)] text-[var(--accent-lime-text)] flex items-center justify-center">
                    <Code2 className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-mono font-medium tracking-tight text-[var(--foreground)]">
                    sometimes i code
                  </span>
                </div>

                {presenceData?.isCoding ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--accent-lime)] bg-[var(--accent-lime)]/10 border border-[var(--accent-lime)]/30 px-2.5 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-lime)] animate-pulse" />
                    <span>coding right now</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--foreground-secondary)] bg-[var(--surface-elevated)] px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--foreground-secondary)]/50" />
                    <span>away from keyboard</span>
                  </span>
                )}
              </div>

              {/* Discord Rich Presence Body */}
              <div className="py-4">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-lime)]/40 transition-all duration-300 shadow-md">
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Large Activity Avatar with Small Language Badge */}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-center p-2.5 shadow-inner">
                        {presenceData?.editor === "antigravity" ? (
                          <AntigravityIcon className="w-full h-full text-[var(--accent-lime)]" />
                        ) : presenceData?.editor === "vs code" ? (
                          <VSCodeIcon className="w-full h-full text-[#388bfd]" />
                        ) : (
                          <Terminal className="w-7 h-7 text-[var(--foreground-secondary)]" />
                        )}
                      </div>

                      {/* Discord-style Small Badge on the corner */}
                      {presenceData?.isCoding && (
                        <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[var(--surface)] text-[9px] font-mono font-bold tracking-tight border border-[var(--border-subtle)] shadow-sm text-[var(--accent-lime)] flex items-center justify-center min-w-[20px]">
                          {presenceData.extension?.replace(".", "").toUpperCase() || "DEV"}
                        </div>
                      )}
                    </div>

                    {/* Rich Presence Text Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-[var(--foreground)] truncate">
                          {presenceData?.editorDisplay || (presenceLoading ? "connecting..." : "offline")}
                        </h4>
                        {presenceData?.isCoding && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--surface)] text-[var(--foreground-secondary)] border border-[var(--border-subtle)]">
                            rpc
                          </span>
                        )}
                      </div>

                      {/* The small phrase requested by the user */}
                      <p className="text-xs sm:text-sm font-mono font-bold text-[var(--accent-lime)] truncate mt-0.5">
                        {presenceData?.isCoding
                          ? presenceData.phrase
                          : (presenceLoading ? "querying active sessions..." : "currently away from editor")}
                      </p>

                      {/* Secondary details and live elapsed timer */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] font-mono text-[var(--foreground-secondary)]">
                        {presenceData?.isCoding ? (
                          <>
                            <span className="truncate">
                              syntax: {presenceData.language}
                            </span>
                            <span className="flex items-center gap-1 text-[var(--accent-lime)]">
                              <Clock className="w-3 h-3" />
                              <span>{elapsedTime} elapsed</span>
                            </span>
                          </>
                        ) : (
                          <span>not coding right now • taking a break</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--foreground-secondary)]">
                <span>jodhpur, rajasthan, india</span>
                <span className="text-[var(--accent-lime)] font-semibold">
                  {presenceData?.isCoding ? "active session" : "standby"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
