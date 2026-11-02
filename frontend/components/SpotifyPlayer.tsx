"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Music, ExternalLink, Disc, HelpCircle, Clock } from "lucide-react";

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  playedAt?: string;
  isConfigured: boolean;
  message?: string;
}

export default function SpotifyPlayer() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    async function fetchSpotify() {
      try {
        const res = await fetch("/api/spotify");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load Spotify track", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSpotify();
    const interval = setInterval(fetchSpotify, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative border border-[#292C37] hover:border-[#F3B73E]/40 transition-all duration-300 bg-[#101219]">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#292C37]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#F3B73E] text-[#08090D] flex items-center justify-center">
              <Music className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-mono font-semibold tracking-wider uppercase text-[#F4F2ED]">
              Music Telemetry
            </span>
          </div>

          <div className="flex items-center gap-2">
            {data?.isPlaying ? (
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#F3B73E] bg-[#F3B73E]/15 border border-[#F3B73E]/30 px-2.5 py-0.5 rounded-full font-semibold shadow-[0_0_10px_rgba(243,183,62,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F3B73E] animate-pulse" />
                NOW PLAYING
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-mono text-[#9296A3] bg-[#171A24] px-2.5 py-0.5 rounded-full border border-[#292C37]">
                <Clock className="w-3 h-3 text-[#9296A3]" />
                RECENTLY PLAYED
              </span>
            )}

            {!data?.isConfigured && (
              <button
                onClick={() => setShowConfigModal(true)}
                className="text-[#9296A3] hover:text-[#F3B73E] transition-colors"
                title="Spotify setup details"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Track Content */}
        <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Vinyl Frame with Artwork */}
          <div className="relative group shrink-0">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border border-[#292C37] bg-[#08090D]">
              {data?.albumImageUrl ? (
                <Image
                  src={data.albumImageUrl}
                  alt={data.title || "Album Art"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#9296A3]">
                  <Disc className="w-8 h-8 animate-spin" style={{ animationDuration: "6s" }} />
                </div>
              )}
            </div>

            {/* Golden Equalizer bars when playing */}
            {data?.isPlaying && (
              <div className="absolute bottom-2 right-2 bg-[#08090D]/85 backdrop-blur-xs p-1.5 rounded-lg flex items-end gap-0.5 h-5 border border-white/10">
                <span className="w-1 bg-[#F3B73E] rounded-full eq-bar-1" />
                <span className="w-1 bg-[#F3B73E] rounded-full eq-bar-2" />
                <span className="w-1 bg-[#F3B73E] rounded-full eq-bar-3" />
              </div>
            )}
          </div>

          {/* Song Metadata */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="text-[11px] font-mono text-[#9296A3] uppercase tracking-wider">
              {data?.isPlaying ? "Live Spotify Stream" : "Last Track"}
            </div>
            <h4 className="text-base sm:text-lg font-sans font-bold text-[#F4F2ED] truncate mt-0.5">
              {data?.title || (loading ? "Connecting to Spotify..." : "Quiet Session")}
            </h4>
            <p className="text-xs sm:text-sm font-medium text-[#F3B73E] truncate mt-0.5">
              {data?.artist || "Mayank Soni"}
            </p>
            {data?.album && (
              <p className="text-[11px] font-mono text-[#9296A3] truncate mt-1">
                Album: {data.album}
              </p>
            )}

            {/* Preview Mode Notice */}
            {!data?.isConfigured && !loading && (
              <div className="mt-2 text-[10px] font-mono text-[#E9AF65] bg-[#E9AF65]/10 px-2.5 py-1 rounded-md border border-[#E9AF65]/30 flex items-center gap-2">
                <span>Credentials loaded</span>
                <span className="text-[#F3B73E] underline cursor-pointer" onClick={() => setShowConfigModal(true)}>
                  1-Click Authorize &rarr;
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer link to Spotify */}
      <div className="mt-6 pt-4 border-t border-[#292C37] flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#656877]">
          SPOTIFY WEB API OAUTH 2.0
        </span>

        {data?.songUrl && (
          <a
            href={data.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#F3B73E] hover:text-[#F5C45E] flex items-center gap-1 transition-colors"
          >
            <span>Listen on Spotify</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* 1-Click Authorization Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090D]/85 backdrop-blur-md">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#292C37] bg-[#101219] text-[#F4F2ED]">
            <div className="w-10 h-10 rounded-full bg-[#F3B73E]/15 text-[#F3B73E] border border-[#F3B73E]/30 flex items-center justify-center mb-3">
              <Music className="w-5 h-5" />
            </div>

            <h4 className="text-lg font-sans font-bold text-[#F4F2ED]">
              Authorize Spotify Telemetry
            </h4>
            <p className="text-xs text-[#9296A3] mt-2 leading-relaxed">
              Your Client ID and Client Secret have been verified. Spotify requires you to log in once to authorize read access to your currently playing tracks.
            </p>

            <div className="mt-4 p-3 bg-[#08090D] rounded-xl border border-[#292C37] text-xs font-mono text-[#9296A3] space-y-1">
              <div>Redirect URI to add in Spotify Dashboard:</div>
              <div className="text-[#F3B73E] select-all">http://127.0.0.1:3000/api/spotify/callback</div>
            </div>

            <div className="mt-6 space-y-2">
              <a
                href="/api/spotify/login"
                className="w-full py-3 bg-[#F3B73E] text-[#08090D] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#F5C45E] transition-colors shadow-[0_0_20px_-3px_rgba(243,183,62,0.4)]"
              >
                <span>Authorize with Spotify (1-Click)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setShowConfigModal(false)}
                className="w-full py-2.5 bg-[#171A24] text-[#9296A3] hover:text-[#F4F2ED] rounded-xl text-xs font-medium border border-[#292C37]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
