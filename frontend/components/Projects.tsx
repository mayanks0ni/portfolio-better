"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Github,
  Maximize2,
  Cpu,
  Route,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { PROJECTS, Project } from "../data/portfolio-data";
import ProjectDetailModal from "./ProjectDetailModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card-reveal");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power2.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                toggleActions: "play none none none",
                once: true,
              },
            }
          );
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="projects"
      ref={containerRef}
      className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)] lowercase"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-[var(--foreground-secondary)] mb-3">
            <span className="text-[var(--accent-lime)] font-semibold">03</span>
            <span className="w-8 h-[1px] bg-[var(--border-subtle)]" />
            <span>selected work &amp; research</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-editorial italic font-normal text-[var(--foreground)] tracking-tight leading-tight">
            deep learning research, ai platforms, and graph systems.
          </h2>
        </div>
        <p className="max-w-md text-xs sm:text-sm text-[var(--foreground-secondary)] font-mono leading-relaxed">
          hard structural pruning on diffusion transformers, full-stack micro-learning feed architectures, and c++ geospatial pathfinding engines.
        </p>
      </div>

      <div className="space-y-10 sm:space-y-14">
        {/* ========================================================
            FEATURED PROJECT 01: DIT-XL/2 STRUCTURAL PRUNING (Research Work)
           ======================================================== */}
        <div className="project-card-reveal glass-panel rounded-3xl p-6 sm:p-9 border border-[var(--border-subtle)] hover:border-[var(--accent-lime)]/50 transition-all duration-300 shadow-xl relative bg-[var(--surface)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
            {/* Left Column: Interactive Architectural Telemetry */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--background)] shadow-2xl text-[var(--foreground)] font-mono text-xs">
                {/* Title Bar */}
                <div className="px-4 py-2.5 bg-[var(--surface-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
                    <span className="text-[11px] text-[var(--foreground)] font-medium">
                      dit-xl/2 — inference structural pruning telemetry
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--accent-lime)] bg-[var(--accent-lime)]/15 px-2 py-0.5 rounded border border-[var(--accent-lime)]/30 font-semibold">
                    dr. palash das lab
                  </span>
                </div>

                {/* Simulated Compute & Structural Ablations */}
                <div className="p-4 sm:p-5 space-y-3 font-mono text-[11px] leading-relaxed select-none">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                      <div className="text-[var(--foreground-secondary)] text-[9px]">gflops cut</div>
                      <div className="text-[var(--accent-lime)] font-bold text-sm">-34%</div>
                    </div>
                    <div className="bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                      <div className="text-[var(--foreground-secondary)] text-[9px]">ffn width</div>
                      <div className="text-[var(--accent-amber)] font-bold text-sm">4608 → 3456</div>
                    </div>
                    <div className="bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                      <div className="text-[var(--foreground-secondary)] text-[9px]">token bypass</div>
                      <div className="text-[var(--foreground)] font-bold text-sm">bottom 20%</div>
                    </div>
                    <div className="bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                      <div className="text-[var(--foreground-secondary)] text-[9px]">attention</div>
                      <div className="text-[var(--accent-blue)] font-bold text-sm">o(t²) → o(t)</div>
                    </div>
                  </div>

                  {/* Structural Pruning Execution Log */}
                  <div className="pt-1 text-[var(--foreground)] space-y-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--accent-lime)]">&bull;</span>
                      <span>ffn movement pruning (|grad × weight|) physically removes neurons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--accent-lime)]">&bull;</span>
                      <span>attend-then-prune: skips bottom-20% tokens in layers 9–19</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--accent-lime)]">&bull;</span>
                      <span>cat merging (k-means + global k/v mean-pooling) cuts attention</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--accent-lime)]">&bull;</span>
                      <span>fixed adaln double-call modulation bug; zero blob artifacts</span>
                    </div>
                    <div className="text-[var(--accent-lime)] font-medium pt-0.5">
                      &bull; timestep schedule: 10% → 20% scaling across 250 denoising steps
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 bg-[var(--surface)] border-t border-[var(--border-subtle)] text-[10px] text-[var(--foreground-secondary)] flex justify-between">
                  <span>zero retraining // structural neuron removal</span>
                  <span className="text-[var(--accent-lime)]">28 blocks // 250 steps</span>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--foreground-secondary)] mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-[var(--accent-lime)]/15 text-[var(--accent-lime)] font-semibold border border-[var(--accent-lime)]/30">
                    01
                  </span>
                  <span>deep learning research</span>
                  <span>•</span>
                  <span>2024</span>
                </div>

                <h3 className="text-2xl font-sans font-bold text-[var(--foreground)] tracking-tight">
                  dit-xl/2 structural pruning
                </h3>
                <p className="text-xs font-editorial italic text-[var(--accent-lime)] mt-1">
                  inference-time gflops reduction under dr. palash das
                </p>

                <p className="text-xs text-[var(--foreground-secondary)] mt-3 leading-relaxed font-sans font-light">
                  hard structural pruning on dit-xl/2 for imagenet 256×256 generation without retraining, cutting inference compute by up to 34% across 250 denoising steps.
                </p>

                {/* Core Breakthrough Callouts */}
                <div className="mt-3 p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--foreground)] space-y-1">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[var(--accent-lime)] font-bold">✓</span>
                    <span>
                      <strong className="text-[var(--foreground)] font-semibold">ffn width pruning:</strong> 25% compute cut per block (4608 → 3456).
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[var(--accent-lime)] font-bold">✓</span>
                    <span>
                      <strong className="text-[var(--foreground)] font-semibold">cat merging:</strong> skips bottom-20% tokens; attention reduced to o(t).
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[var(--accent-lime)] font-bold">✓</span>
                    <span>
                      <strong className="text-[var(--foreground)] font-semibold">adaln bugfix:</strong> resolved modulation gates, eliminating blob artifacts.
                    </span>
                  </div>
                </div>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {[
                    "pytorch",
                    "dit-xl/2",
                    "movement pruning",
                    "cat merging",
                    "adaln fix",
                    "imagenet 256×256",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[var(--surface-elevated)] text-[var(--foreground-secondary)] border border-[var(--border-subtle)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-3">
                <button
                  onClick={() =>
                    setActiveProject(PROJECTS.find((p) => p.id === "dit-pruning") || null)
                  }
                  className="px-4 py-2 rounded-full bg-[var(--accent-lime)] text-[var(--accent-lime-text)] text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-[0_0_15px_-3px_rgba(243,183,62,0.35)]"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>inspect spec &amp; architecture</span>
                </button>

                <a
                  href="https://github.com/mayanks0ni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full glass-panel hover:border-[var(--accent-lime)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] border border-[var(--border-subtle)] transition-colors"
                  title="view github repository"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            FEATURED PROJECT 02: CASCADE (Micro-Learning Feed & Focus Engine)
           ======================================================== */}
        <div className="project-card-reveal glass-panel rounded-3xl p-6 sm:p-9 border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50 transition-all duration-300 shadow-xl relative bg-[var(--surface)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
            {/* Left Column: Narrative */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--foreground-secondary)] mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-[var(--accent-blue)]/15 text-[var(--accent-blue)] font-semibold border border-[var(--accent-blue)]/30">
                    02
                  </span>
                  <span>full-stack ai &amp; micro-learning</span>
                  <span>•</span>
                  <span>2025</span>
                </div>

                <h3 className="text-2xl font-sans font-bold text-[var(--foreground)] tracking-tight">
                  cascade
                </h3>
                <p className="text-xs font-editorial italic text-[var(--accent-blue)] mt-1">
                  turning doomscrolling into deep learning
                </p>

                <p className="text-xs text-[var(--foreground-secondary)] mt-3 leading-relaxed font-sans font-light">
                  transforms endless scrolling into structured learning sessions with ai-generated feeds, embedded quizzes, focus tracking, and session analytics.
                </p>

                <div className="mt-3 p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--foreground)] space-y-1">
                  <div>• gemini micro-lessons backed by pinecone vector search</div>
                  <div>• scroll telemetry &amp; focus interruption detection</div>
                  <div>• session study recaps &amp; eduwrapped visual analytics</div>
                </div>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {[
                    "next.js 15",
                    "typescript",
                    "tailwind css",
                    "firebase",
                    "gemini api",
                    "pinecone",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[var(--surface-elevated)] text-[var(--foreground-secondary)] border border-[var(--border-subtle)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-3">
                <button
                  onClick={() =>
                    setActiveProject(PROJECTS.find((p) => p.id === "cascade") || null)
                  }
                  className="px-4 py-2 rounded-full bg-[var(--accent-blue)] text-white text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-[0_0_15px_-3px_rgba(113,133,255,0.4)]"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>inspect spec &amp; architecture</span>
                </button>

                <a
                  href="https://github.com/mayanks0ni/cascade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full glass-panel hover:border-[var(--accent-blue)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] border border-[var(--border-subtle)] transition-colors"
                  title="view github repository"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Micro-Learning Feed */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl p-4 sm:p-5 bg-[var(--background)] border border-[var(--border-subtle)] shadow-2xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] text-[var(--foreground-secondary)] pb-2 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                    <span>cascade — micro-learning engine &amp; focus telemetry</span>
                  </div>
                  <span className="text-[var(--accent-blue)]">gemini + pinecone</span>
                </div>

                {/* Simulated Feed Card & Quiz */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[var(--accent-blue)] font-semibold">topic: distributed consensus</span>
                      <span className="text-[var(--foreground-secondary)] bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
                        micro-lesson #14
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--foreground)] leading-snug">
                      paxos guarantees agreement across asynchronous networks. proposals require acceptances from a majority quorum (2f+1 nodes).
                    </p>
                  </div>

                  {/* Embedded Knowledge Check Quiz */}
                  <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--accent-blue)]/30 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--accent-blue)]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>quick check: quorum requirement</span>
                    </div>
                    <div className="text-[11px] text-[var(--foreground)] font-medium">
                      why does paxos require at least 2f + 1 nodes to tolerate f failures?
                    </div>
                    <div className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--accent-blue)]/50 text-[var(--foreground)] flex items-center justify-between text-[10px]">
                      <span>a. any two majorities intersect</span>
                      <span className="text-[var(--accent-lime)]">correct</span>
                    </div>
                  </div>

                  {/* Focus & Engagement Analytics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[10px]">
                    <div className="bg-[var(--surface)] p-2 rounded-lg border border-[var(--border-subtle)]">
                      <div className="text-[var(--foreground-secondary)] text-[9px]">scroll mode</div>
                      <div className="text-[var(--accent-lime)] font-bold">active study</div>
                    </div>
                    <div className="bg-[var(--surface)] p-2 rounded-lg border border-[var(--border-subtle)]">
                      <div className="text-[var(--foreground-secondary)] text-[9px]">interruptions</div>
                      <div className="text-[var(--accent-blue)] font-bold">0 drops</div>
                    </div>
                    <div className="bg-[var(--surface)] p-2 rounded-lg border border-[var(--border-subtle)]">
                      <div className="text-[var(--foreground-secondary)] text-[9px]">retention</div>
                      <div className="text-[var(--accent-amber)] font-bold">94.2%</div>
                    </div>
                    <div className="bg-[var(--surface)] p-2 rounded-lg border border-[var(--border-subtle)]">
                      <div className="text-[var(--foreground-secondary)] text-[9px]">eduwrapped</div>
                      <div className="text-[var(--foreground)] font-bold">generated</div>
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-[var(--surface)] text-[var(--foreground-secondary)] rounded-xl font-mono text-[10px] flex items-center justify-between border border-[var(--border-subtle)]">
                  <span>infinite micro-learning feed // vector relevance</span>
                  <span className="text-[var(--accent-blue)]">firebase + gemini</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            FEATURED PROJECT 03: EV ROUTE OPTIMIZATION SYSTEM (C++17 Pathfinder)
           ======================================================== */}
        <div className="project-card-reveal glass-panel rounded-3xl p-6 sm:p-9 border border-[var(--border-subtle)] hover:border-[var(--accent-amber)]/50 transition-all duration-300 shadow-xl relative bg-[var(--surface)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
            {/* Left Column: C++17 Graph Pathfinder Telemetry */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--background)] shadow-2xl text-[var(--foreground)] font-mono text-xs">
                {/* Title Bar */}
                <div className="px-4 py-2.5 bg-[var(--surface-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Route className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                    <span className="text-[11px] text-[var(--foreground)] font-medium">
                      ev route optimizer — c++17 graph pathfinder
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--accent-amber)] bg-[var(--accent-amber)]/15 px-2 py-0.5 rounded border border-[var(--accent-amber)]/30 font-semibold">
                    jaipur road network
                  </span>
                </div>

                {/* Graph Traversal & Constraints Simulation */}
                <div className="p-4 sm:p-5 space-y-3 font-mono text-[11px] leading-relaxed select-none">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                      <div className="text-[var(--foreground-secondary)] text-[9px]">osm nodes</div>
                      <div className="text-[var(--accent-amber)] font-bold text-sm">150,000+</div>
                    </div>
                    <div className="bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                      <div className="text-[var(--foreground-secondary)] text-[9px]">algorithm</div>
                      <div className="text-[var(--accent-lime)] font-bold text-sm">dijkstra min-heap</div>
                    </div>
                    <div className="bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                      <div className="text-[var(--foreground-secondary)] text-[9px]">complexity</div>
                      <div className="text-[var(--foreground)] font-bold text-sm">o((v+e) log v)</div>
                    </div>
                    <div className="bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                      <div className="text-[var(--foreground-secondary)] text-[9px]">constraint</div>
                      <div className="text-[var(--accent-blue)] font-bold text-sm">safe interval</div>
                    </div>
                  </div>

                  {/* C++ Pathfinding Execution Trace */}
                  <div className="pt-1 text-[var(--foreground)] space-y-1 text-[11px]">
                    <div>
                      <span className="text-[var(--foreground-secondary)]">&gt;</span> priority queue min-heap evaluating next closest node
                    </div>
                    <div className="p-1.5 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[10px] text-[var(--foreground-secondary)]">
                      struct State &#123; int node: 4821; double since: 14.2km; double total: 68.4km; &#125;;
                    </div>
                    <div>
                      <span className="text-[var(--foreground-secondary)]">&gt;</span> station reached at 18.5km &lt; max battery threshold
                    </div>
                    <div className="text-[var(--accent-lime)] font-medium">
                      &bull; path reconstructed via parent[V] // travel time estimated
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 bg-[var(--surface)] border-t border-[var(--border-subtle)] text-[10px] text-[var(--foreground-secondary)] flex justify-between">
                  <span>cpp-httplib json server // stl queues</span>
                  <span className="text-[var(--accent-amber)]">react + cytoscape.js</span>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--foreground-secondary)] mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-[var(--accent-amber)]/15 text-[var(--accent-amber)] font-semibold border border-[var(--accent-amber)]/30">
                    03
                  </span>
                  <span>algorithms &amp; geospatial</span>
                  <span>•</span>
                  <span>2024</span>
                </div>

                <h3 className="text-2xl font-sans font-bold text-[var(--foreground)] tracking-tight">
                  ev route optimization system
                </h3>
                <p className="text-xs font-editorial italic text-[var(--accent-amber)] mt-1">
                  c++ intelligent pathfinder &amp; charging network engine
                </p>

                <p className="text-xs text-[var(--foreground-secondary)] mt-3 leading-relaxed font-sans font-light">
                  c++ route planning system on 150k openstreetmap nodes ensuring charging stations are reachable within safe battery depletion limits.
                </p>

                <div className="mt-3 p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--foreground)] space-y-1">
                  <div>• dijkstra on 150k+ jaipur road network nodes preprocessed to 1..n</div>
                  <div>• custom state struct tracking distance since last charging stop</div>
                  <div>• cpp-httplib server dispatching routes to cytoscape.js</div>
                </div>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {[
                    "c++17",
                    "dijkstra algorithm",
                    "openstreetmap",
                    "priority queue",
                    "cpp-httplib",
                    "cytoscape.js",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[var(--surface-elevated)] text-[var(--foreground-secondary)] border border-[var(--border-subtle)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-3">
                <button
                  onClick={() =>
                    setActiveProject(
                      PROJECTS.find((p) => p.id === "ev-route-optimization-system") || null
                    )
                  }
                  className="px-4 py-2 rounded-full bg-[var(--accent-amber)] text-[var(--accent-gold-text)] text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-[0_0_15px_-3px_rgba(243,183,62,0.35)]"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>inspect spec &amp; architecture</span>
                </button>

                <a
                  href="https://github.com/mayanks0ni/ev-route-optimization-system"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full glass-panel hover:border-[var(--accent-amber)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] border border-[var(--border-subtle)] transition-colors"
                  title="view github repository"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}
