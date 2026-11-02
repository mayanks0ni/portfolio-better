"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Film, Image as ImageIcon, ExternalLink } from "lucide-react";
import { CollectionItem } from "../app/api/collection/route";

interface LightboxModalProps {
  item: CollectionItem | null;
  onClose: () => void;
}

export default function LightboxModal({ item, onClose }: LightboxModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const currentVideo = videoRef.current;

    if (item) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
      if (currentVideo) {
        currentVideo.pause();
      }
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto lowercase">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl p-5 sm:p-7 shadow-2xl border border-[var(--border-subtle)] my-6 z-10 max-h-[92vh] overflow-y-auto bg-[var(--surface)] text-[var(--foreground)]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-lime)]">
              <span className="px-2 py-0.5 rounded-full bg-[var(--accent-lime)]/10 border border-[var(--accent-lime)]/20">
                {item.category}
              </span>
              <span>•</span>
              <span className="text-[var(--foreground-secondary)]">{item.year || "2024"}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-sans font-bold text-[var(--foreground)] mt-1.5 truncate">
              {item.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full glass-panel hover:border-[var(--accent-lime)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] border border-[var(--border-subtle)] transition-colors shrink-0"
            aria-label="close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Frame (Video or Image) */}
        <div className="mt-5 rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-elevated)] relative flex items-center justify-center min-h-[320px] max-h-[65vh]">
          {item.mediaType === "video" ? (
            <video
              ref={videoRef}
              src={item.src}
              controls
              autoPlay
              loop
              playsInline
              className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain mx-auto"
            />
          ) : (
            <div className="relative w-full h-[55vh]">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>
          )}
        </div>

        {/* Description & Tools */}
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
            <h5 className="text-[11px] font-mono text-[var(--foreground-secondary)] mb-1">
              creative context &amp; concept
            </h5>
            <p className="text-sm text-[var(--foreground)] leading-relaxed font-sans font-light">
              {item.description}
            </p>
          </div>

          {item.tools && item.tools.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[var(--foreground-secondary)] mr-1">
                tools:
              </span>
              {item.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[var(--surface-elevated)] text-[var(--accent-lime)] border border-[var(--border-subtle)]"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--foreground-secondary)]">
          <span className="flex items-center gap-1.5">
            {item.mediaType === "video" ? (
              <Film className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
            )}
            <span>{item.filename}</span>
          </span>

          <a
            href={item.src}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[var(--accent-lime)] hover:underline"
          >
            <span>open raw asset</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
