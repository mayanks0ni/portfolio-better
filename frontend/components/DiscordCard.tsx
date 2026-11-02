"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageSquare, Copy, Check, ExternalLink } from "lucide-react";
import { SOCIAL_LINKS } from "../data/portfolio-data";

function XIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="x">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function RedditIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="reddit">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.248a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.56 12 8 12.56 8 13.25c0 .688.56 1.25 1.25 1.25.688 0 1.25-.56 1.25-1.25 0-.688-.56-1.25-1.25-1.25zm5.5 0c-.688 0-1.25.56-1.25 1.25 0 .688.56 1.25 1.25 1.25.688 0 1.25-.56 1.25-1.25 0-.688-.56-1.25-1.25-1.25zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.844.843 2.325.912 2.947.912.623 0 2.104-.07 2.948-.912a.33.33 0 0 0-.232-.557.327.327 0 0 0-.23.094c-.6.6-1.767.7-2.486.7-.72 0-1.887-.1-2.486-.7a.327.327 0 0 0-.23-.094z" />
    </svg>
  );
}

export default function DiscordCard() {
  const [copied, setCopied] = useState(false);
  const discordTag = SOCIAL_LINKS.discord || "spider_mon_";

  const handleCopy = () => {
    navigator.clipboard.writeText(discordTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50 transition-all duration-300 relative overflow-hidden bg-[var(--surface)] lowercase">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-blue)] text-white flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-mono font-medium text-[var(--foreground)]">
              direct frequency
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--accent-lime)] bg-[var(--accent-lime)]/10 px-2.5 py-0.5 rounded-full border border-[var(--accent-lime)]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-lime)] shadow-[0_0_8px_var(--accent-lime)] animate-pulse" />
            <span>online // open</span>
          </div>
        </div>

        {/* Narrative & Direct Communication Handles */}
        <div className="mt-4">
          <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed font-sans mb-3.5">
            reach out directly for collaborations, research topics, quick discussions or if you want share playlists ;p.
          </p>

          <div className="space-y-2.5">
            {/* Discord Username */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] hover:border-[#5865F2]/40 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--border-subtle)] shrink-0 bg-[var(--background)]">
                  <Image
                    src={SOCIAL_LINKS.discordAvatar || "/discord-avatar.png"}
                    alt="discord pfp"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[var(--foreground-secondary)]">
                    discord
                  </div>
                  <div className="text-sm font-mono font-semibold text-[var(--foreground)] truncate">
                    @{discordTag}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 shrink-0 transition-all duration-200 ${copied
                  ? "bg-[var(--accent-lime)] text-[var(--accent-lime-text)] shadow-[0_0_12px_rgba(243,183,62,0.4)]"
                  : "bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent-lime)] border border-[var(--border-subtle)]"
                  }`}
                title="copy discord handle"
              >
                {copied ? (
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
            </div>

            {/* X (Twitter) Handle */}
            <a
              href={SOCIAL_LINKS.x}
              target="_blank"
              rel="noopener noreferrer"
              className="group/x flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--foreground)]/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 text-[var(--foreground)] group-hover/x:border-[var(--foreground)]/60 transition-colors">
                  <XIcon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[var(--foreground-secondary)]">
                    x // twitter
                  </div>
                  <div className="text-sm font-mono font-semibold text-[var(--foreground)] group-hover/x:text-[var(--foreground)] truncate">
                    @{SOCIAL_LINKS.xUser}
                  </div>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 shrink-0 bg-[var(--surface)] text-[var(--foreground-secondary)] group-hover/x:text-[var(--foreground)] group-hover/x:border-[var(--foreground)]/40 border border-[var(--border-subtle)] transition-all">
                <span>open</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>

            {/* Reddit Handle */}
            <a
              href={SOCIAL_LINKS.reddit}
              target="_blank"
              rel="noopener noreferrer"
              className="group/reddit flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] hover:border-[#FF4500]/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/25 flex items-center justify-center shrink-0 group-hover/reddit:bg-[#FF4500] group-hover/reddit:text-white transition-colors">
                  <RedditIcon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[var(--foreground-secondary)]">
                    reddit
                  </div>
                  <div className="text-sm font-mono font-semibold text-[var(--foreground)] group-hover/reddit:text-[#FF4500] truncate transition-colors">
                    u/{SOCIAL_LINKS.redditUser}
                  </div>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 shrink-0 bg-[var(--surface)] text-[var(--foreground-secondary)] group-hover/reddit:text-[#FF4500] group-hover/reddit:border-[#FF4500]/40 border border-[var(--border-subtle)] transition-all">
                <span>open</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono text-[var(--foreground-muted)]">
        <span>community &amp; networking</span>
        <span className="text-[var(--foreground-secondary)]">hit me up when you&apos;re up late night</span>
      </div>
    </div>
  );
}
