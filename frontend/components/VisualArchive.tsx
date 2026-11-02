"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Palette,
  Maximize2,
  Film,
  Image as ImageIcon,
  Play,
  Volume2,
  VolumeX,
  Orbit,
  LayoutGrid,
} from "lucide-react";
import { CollectionItem } from "../app/api/collection/route";
import { CREATIVE_ARCHIVE } from "../data/portfolio-data";
import LightboxModal from "./LightboxModal";
import CircularGallery, { GalleryItem } from "./CircularGallery";

function CollectionCardItem({
  item,
  onSelect,
}: {
  item: CollectionItem;
  onSelect: (item: CollectionItem) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (item.mediaType === "video" && videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser policy prevents unmuted hover playback, fallback to muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => { });
          }
        });
    }
  };

  const handleMouseLeave = () => {
    if (item.mediaType === "video" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => { });
      }
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group glass-panel rounded-3xl p-4 sm:p-5 border border-[var(--border-subtle)] hover:border-[var(--accent-lime)]/50 transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between bg-[var(--surface)]"
    >
      <div>
        {/* Media Thumbnail Container */}
        <div
          className={`w-full ${item.aspectRatio || "aspect-[16/9]"
            } rounded-2xl relative overflow-hidden flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--surface-elevated)] group-hover:scale-[1.01] transition-transform duration-500`}
        >
          {item.mediaType === "video" ? (
            <div className="relative w-full h-full bg-black/50 flex items-center justify-center">
              <video
                ref={videoRef}
                src={item.src}
                muted={isMuted}
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {/* Play Badge Overlay — Fades out when video is playing on hover */}
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isPlaying ? "opacity-0" : "opacity-90"
                  }`}
              >
                <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md text-[var(--accent-lime)] border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>

              {/* Mute / Unmute Toggle Button */}
              <div className="absolute top-3 right-3 z-20">
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 transition-all duration-200 shadow-md ${isMuted
                    ? "bg-black/75 backdrop-blur-md text-white/90 border border-white/20 hover:border-[var(--accent-lime)] hover:text-[var(--accent-lime)]"
                    : "bg-[var(--accent-lime)] text-[var(--accent-lime-text)] border border-[var(--accent-lime)] font-semibold shadow-[0_0_12px_rgba(243,183,62,0.4)]"
                    }`}
                  title={isMuted ? "unmute audio" : "mute audio"}
                  aria-label={isMuted ? "unmute audio" : "mute audio"}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>unmute</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                      <span>mute</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Category Pill Tag */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1.5 border border-white/10 z-10 pointer-events-none">
            {item.mediaType === "video" ? (
              <Film className="w-3 h-3 text-[var(--accent-lime)]" />
            ) : (
              <ImageIcon className="w-3 h-3 text-[var(--accent-blue)]" />
            )}
            <span>{item.category}</span>
          </div>

          {/* Maximize Pill */}
          <div className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/15 z-10 pointer-events-none">
            <Maximize2 className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
          </div>
        </div>

        {/* Text Info */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--foreground-secondary)]">
            <span>{item.year || "2024"}</span>
            <span className="text-[var(--accent-lime)]">visual archive</span>
          </div>
          <h4 className="text-base font-sans font-bold text-[var(--foreground)] mt-1 group-hover:text-[var(--accent-lime)] transition-colors truncate">
            {item.title}
          </h4>
          <p className="text-xs text-[var(--foreground-secondary)] mt-1.5 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>

      {/* Tools footer */}
      {item.tools && item.tools.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex flex-wrap gap-1.5">
          {item.tools.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--surface-elevated)] text-[var(--foreground-secondary)] border border-[var(--border-subtle)]"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const INITIAL_COLLECTION_ITEMS: CollectionItem[] = CREATIVE_ARCHIVE.map((item) => ({
  id: item.id,
  title: item.title,
  category: item.category,
  mediaType: item.mediaType || "image",
  src: item.src || "/collection/designs/aui-banner.png",
  thumbnail: item.thumbnail || item.src,
  filename: `${item.id}.png`,
  extension: ".png",
  year: item.year,
  description: item.description,
  tools: item.tools,
  aspectRatio: item.aspect,
}));

export default function VisualArchive() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"circular" | "grid">("circular");
  const [items, setItems] = useState<CollectionItem[]>(INITIAL_COLLECTION_ITEMS);
  const [activeItem, setActiveItem] = useState<CollectionItem | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
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
    async function loadCollection() {
      try {
        const res = await fetch("/api/collection");
        if (res.ok) {
          const json = await res.json();
          if (json.items && json.items.length > 0) {
            setItems(json.items);
            return;
          }
        }
      } catch (err) {
        console.error("failed to fetch collection:", err);
      }

      // Fallback to static archive items converted to CollectionItem
      const fallback: CollectionItem[] = CREATIVE_ARCHIVE.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        mediaType: item.mediaType || "image",
        src: item.src || "/collection/designs/aui-banner.png",
        thumbnail: item.thumbnail || item.src,
        filename: `${item.id}.png`,
        extension: ".png",
        year: item.year,
        description: item.description,
        tools: item.tools,
        aspectRatio: item.aspect,
      }));
      setItems(fallback);
    }

    loadCollection();
  }, []);

  const categories = [
    "all",
    ...Array.from(new Set(items.map((i) => i.category.toLowerCase()))),
  ];

  const filteredItems = items.filter((item) => {
    if (selectedFilter === "all") return true;
    return item.category.toLowerCase() === selectedFilter.toLowerCase();
  });

  // Prepare items for CircularGallery
  const galleryItems: GalleryItem[] = filteredItems.map((item) => ({
    image: item.thumbnail || item.src,
    text: item.title,
    description: `${item.category} • ${item.year || "2024"} — ${item.description}`,
    alt: item.title,
  }));

  // Ensure enough items for a continuous looping cylindrical arc
  const displayGalleryItems =
    galleryItems.length > 0 && galleryItems.length < 8
      ? [...galleryItems, ...galleryItems]
      : galleryItems;

  const galleryTextColor = isDark ? "#f3b73e" : "#9a5b0b";
  const galleryPlaceholder = isDark ? "#101219" : "#eaeae2";

  return (
    <div className="mt-14 lowercase">
      {/* Archive Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--foreground-secondary)] mb-1">
            <Palette className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
            <span>dynamic creative collection</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-sans font-bold text-[var(--foreground)]">
            visual archive — designs, posters &amp; edits
          </h3>
          <p className="text-xs text-[var(--foreground-secondary)] mt-1 font-mono">
            {viewMode === "circular"
              ? "drag or scroll to rotate the arc; click any card to inspect. btw i use photoshop and after effects"
              : "hover over video sequences to preview with audio controls. btw i use photoshop and after effects"}
          </p>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-full glass-panel border border-[var(--border-subtle)] bg-[var(--surface-elevated)] mr-1">
            <button
              type="button"
              onClick={() => setViewMode("circular")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all duration-200 ${viewMode === "circular"
                ? "bg-[var(--accent-lime)] text-[var(--accent-lime-text)] shadow-sm font-semibold"
                : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                }`}
              title="switch to 3d circular arc gallery"
            >
              <Orbit className="w-3 h-3" />
              <span>3d arc</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all duration-200 ${viewMode === "grid"
                ? "bg-[var(--accent-lime)] text-[var(--accent-lime-text)] shadow-sm font-semibold"
                : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                }`}
              title="switch to editorial grid view"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>grid</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-full text-xs font-medium tracking-tight whitespace-nowrap transition-all duration-200 ${selectedFilter === filter
                  ? "bg-[var(--accent-lime)] text-[var(--accent-lime-text)] font-semibold shadow-[0_0_12px_rgba(243,183,62,0.35)]"
                  : "bg-[var(--surface-elevated)] text-[var(--foreground-secondary)] border border-[var(--border-subtle)] hover:text-[var(--foreground)] hover:border-[var(--accent-lime)]"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Visual Display: 3D CircularGallery OR Editorial Grid */}
      {viewMode === "circular" ? (
        <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden glass-panel border border-[var(--border-subtle)] my-6 shadow-2xl bg-[var(--surface)]">
          {displayGalleryItems.length > 0 ? (
            <CircularGallery
              items={displayGalleryItems}
              bend={3}
              textColor={galleryTextColor}
              placeholderColor={galleryPlaceholder}
              borderRadius={0.05}
              scrollEase={0.05}
              scrollSpeed={2}
              itemSize={0.92}
              itemAspect={1.38}
              gap={0.25}
              wave={1}
              fadeEdges={0.14}
              shadow={0.3}
              snap={true}
              autoScroll={0.12}
              openOnClick={true}
              intro={true}
              onItemClick={(item) => {
                const matched = items.find(
                  (i) => i.title.toLowerCase() === item.text?.toLowerCase()
                );
                if (matched && matched.mediaType === "video") {
                  setActiveItem(matched);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-mono text-[var(--foreground-secondary)]">
              no items found for &quot;{selectedFilter}&quot;
            </div>
          )}

          {/* Interactive Navigation Instruction Pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full glass-panel border border-[var(--border-subtle)] bg-[var(--surface)]/85 backdrop-blur-md text-[11px] font-mono text-[var(--foreground-secondary)] pointer-events-none flex items-center gap-2 shadow-lg z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-lime)] animate-pulse" />
            <span>drag horizontally or scroll to rotate arc • click card to inspect</span>
          </div>
        </div>
      ) : (
        /* Editorial Responsive Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <CollectionCardItem
              key={item.id}
              item={item}
              onSelect={(selected) => setActiveItem(selected)}
            />
          ))}
        </div>
      )}

      {/* Lightbox Modal for Full Media & Video Playback */}
      <LightboxModal item={activeItem} onClose={() => setActiveItem(null)} />
    </div>
  );
}
