"use client";

import { useEffect } from "react";
import { X, ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { Project } from "../data/portfolio-data";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto lowercase">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-9 shadow-2xl border border-[var(--border-subtle)] my-8 z-10 max-h-[90vh] overflow-y-auto subtle-iridescent bg-[var(--surface)]/95 text-[var(--foreground)]">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--foreground-secondary)]">
              <span className="text-[var(--accent-lime)]">{project.category}</span>
              <span>•</span>
              <span>{project.year}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-sans font-bold text-[var(--foreground)] mt-1">
              {project.title}
            </h3>
            <p className="text-sm font-editorial italic text-[var(--accent-lime)] mt-1">
              {project.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full glass-panel hover:border-[var(--accent-lime)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] border border-[var(--border-subtle)] transition-colors shrink-0"
            aria-label="close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Architecture Highlight Pill */}
        <div className="my-5 p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
          <div className="text-xs font-mono text-[var(--foreground-secondary)] mb-1">
            system architecture callout
          </div>
          <p className="text-sm font-sans font-medium text-[var(--foreground)]">
            {project.architectureCallout}
          </p>
          <div className="mt-2 text-xs font-mono text-[var(--foreground-secondary)]">
            metric / throughput: <strong className="text-[var(--accent-lime)] font-semibold">{project.stats}</strong>
          </div>
        </div>

        {/* Narrative Grid */}
        <div className="space-y-5 text-sm text-[var(--foreground)]">
          <div>
            <h4 className="text-xs font-mono text-[var(--foreground-secondary)] font-semibold mb-1.5">
              the engineering problem
            </h4>
            <p className="leading-relaxed bg-[var(--surface-elevated)] p-4 rounded-xl border border-[var(--border-subtle)] text-[var(--foreground-secondary)] font-light">
              {project.problem}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono text-[var(--foreground-secondary)] font-semibold mb-1.5">
              the solution architecture
            </h4>
            <p className="leading-relaxed bg-[var(--surface-elevated)] p-4 rounded-xl border border-[var(--border-subtle)] text-[var(--foreground-secondary)] font-light">
              {project.solution}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono text-[var(--foreground-secondary)] font-semibold mb-1.5">
              engineering contribution
            </h4>
            <p className="leading-relaxed bg-[var(--surface-elevated)] p-4 rounded-xl border border-[var(--border-subtle)] text-[var(--foreground-secondary)] font-light">
              {project.contribution}
            </p>
          </div>

          {/* Tech Stack Chips */}
          <div>
            <h4 className="text-xs font-mono text-[var(--foreground-secondary)] font-semibold mb-2">
              implemented tech stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--border-subtle)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="mt-7 pt-5 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-[var(--accent-lime)] text-[var(--accent-lime-text)] text-xs font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_15px_-3px_rgba(243,183,62,0.35)]"
              >
                <Github className="w-4 h-4" />
                <span>inspect repository</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full glass-panel text-[var(--foreground)] text-xs font-medium flex items-center gap-1.5 border border-[var(--border-subtle)] hover:border-[var(--accent-lime)] hover:text-[var(--accent-lime)] transition-colors"
              >
                <span>live deployment</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <span className="text-xs font-mono text-[var(--foreground-muted)]">
            systems architecture &amp; research
          </span>
        </div>
      </div>
    </div>
  );
}
