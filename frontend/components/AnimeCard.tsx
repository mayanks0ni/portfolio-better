"use client";

import { useState, useEffect } from "react";
import { Tv, ExternalLink } from "lucide-react";
import { SOCIAL_LINKS } from "../data/portfolio-data";

interface AnimeStats {
  username: string;
  avatarUrl?: string;
  profileUrl: string;
  totalCompleted: number;
  currentlyWatching: number;
  totalEntries: number;
  episodesWatched: number;
  daysWatched: number;
  meanScore: number;
  isLive: boolean;
  message?: string;
}

export default function AnimeCard() {
  const [stats, setStats] = useState<AnimeStats | null>(null);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const res = await fetch("/api/anime");
        if (res.ok) {
          const json = await res.json();
          setStats(json);
        }
      } catch (err) {
        console.error("failed to load anime stats", err);
      }
    }

    fetchAnime();
  }, []);

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl relative border border-[var(--border-subtle)] hover:border-[var(--accent-violet)]/40 transition-all duration-300 overflow-hidden bg-[var(--surface)] lowercase">
      {/* Background Japanese Kanji Watermark */}
      <div className="absolute -bottom-8 -right-6 text-8xl font-serif text-[var(--surface-elevated)] select-none pointer-events-none -z-10 font-light opacity-60">
        アニメ
      </div>

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-violet)] text-[var(--accent-lime-text)] flex items-center justify-center text-xs font-bold">
              <Tv className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono font-medium text-[var(--foreground)]">
              anime dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[var(--accent-violet)] bg-[var(--accent-violet)]/10 px-2.5 py-0.5 rounded-full border border-[var(--accent-violet)]/20">
              @{stats?.username || SOCIAL_LINKS.anilistUser || "spideykun05"}
            </span>
          </div>
        </div>

        {/* Narrative & Profile */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <h4 className="text-base sm:text-lg font-sans font-bold text-[var(--foreground)]">
              curated watch archive
            </h4>
            {stats?.meanScore ? (
              <span className="text-xs font-mono text-[var(--foreground-secondary)]">
                mean rating: <strong className="text-[var(--accent-lime)]">{stats.meanScore}%</strong>
              </span>
            ) : null}
          </div>
          <p className="text-xs text-[var(--foreground-secondary)] mt-1 leading-relaxed">
            i watch anything that seems interesting to me.
          </p>
        </div>

        {/* High-Impact Numerical Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <div className="p-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-left hover:border-[var(--accent-violet)]/40 transition-colors min-w-0">
            <div className="text-[10px] font-mono text-[var(--foreground-secondary)] truncate">
              completed
            </div>
            <div className="text-xl sm:text-2xl font-editorial italic font-normal text-[var(--foreground)] mt-0.5 tracking-tight truncate">
              {stats?.totalCompleted ?? 146}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-left hover:border-[var(--accent-lime)]/40 transition-colors min-w-0">
            <div className="text-[10px] font-mono text-[var(--foreground-secondary)] truncate">
              watching
            </div>
            <div className="text-xl sm:text-2xl font-editorial italic font-normal text-[var(--accent-lime)] mt-0.5 tracking-tight truncate">
              {stats?.currentlyWatching ?? 16}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-left hover:border-[var(--accent-violet)]/40 transition-colors min-w-0">
            <div className="text-[10px] font-mono text-[var(--foreground-secondary)] truncate">
              episodes
            </div>
            <div className="text-xl sm:text-2xl font-editorial italic font-normal text-[var(--foreground)] mt-0.5 tracking-tight truncate">
              {stats?.episodesWatched ? stats.episodesWatched.toLocaleString() : "5,253"}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-left hover:border-[var(--accent-violet)]/40 transition-colors min-w-0">
            <div className="text-[10px] font-mono text-[var(--foreground-secondary)] truncate">
              days watched
            </div>
            <div className="text-xl sm:text-2xl font-editorial italic font-normal text-[var(--foreground)] mt-0.5 tracking-tight truncate">
              {stats?.daysWatched ?? "72.3"}d
            </div>
          </div>
        </div>
      </div>

      {/* Footer Link to Profile */}
      <div className="mt-5 pt-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <span className="text-[10px] font-mono text-[var(--foreground-muted)]">
          i used anilist graphql for this^
        </span>

        <a
          href={stats?.profileUrl || `https://anilist.co/user/${SOCIAL_LINKS.anilistUser}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-[var(--accent-violet)] hover:opacity-80 flex items-center gap-1 transition-opacity"
        >
          <span>view anilist profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
