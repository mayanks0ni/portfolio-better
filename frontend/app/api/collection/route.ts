import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export interface CollectionItem {
  id: string;
  title: string;
  category: "designs" | "posters" | "edits" | "experiments" | string;
  mediaType: "image" | "video";
  src: string;
  thumbnail?: string;
  filename: string;
  extension: string;
  year?: string;
  description?: string;
  tools?: string[];
  aspectRatio?: string;
}

const SUPPORTED_IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const SUPPORTED_VIDEO_EXTS = new Set([".mp4", ".webm"]);

function formatTitleFromFilename(filename: string): string {
  const nameWithoutExt = path.parse(filename).name;
  return nameWithoutExt
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export async function GET() {
  let collectionDir = path.join(process.cwd(), "public", "collection");
  if (!fs.existsSync(collectionDir)) {
    collectionDir = path.join(process.cwd(), "frontend", "public", "collection");
  }

  if (!fs.existsSync(collectionDir)) {
    return NextResponse.json({ items: [] });
  }

  const items: CollectionItem[] = [];

  try {
    const subdirs = ["designs", "posters", "edits", "experiments"];

    for (const sub of subdirs) {
      const subPath = path.join(collectionDir, sub);
      if (!fs.existsSync(subPath)) continue;

      const entries = fs.readdirSync(subPath, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (entry.name.endsWith("-thumb.jpg")) continue;

        const ext = path.extname(entry.name).toLowerCase();
        const isImage = SUPPORTED_IMAGE_EXTS.has(ext);
        const isVideo = SUPPORTED_VIDEO_EXTS.has(ext);

        if (!isImage && !isVideo) continue;

        const baseName = path.parse(entry.name).name;
        const metaPath = path.join(subPath, `${baseName}.json`);

        let metadata: Partial<CollectionItem> = {};
        if (fs.existsSync(metaPath)) {
          try {
            const rawMeta = fs.readFileSync(metaPath, "utf8");
            metadata = JSON.parse(rawMeta);
          } catch {
            // Ignore invalid JSON metadata
          }
        }

        const id = `${sub}-${baseName}`.toLowerCase();
        const title = (metadata.title || formatTitleFromFilename(entry.name)).toLowerCase();
        const description = (
          metadata.description || `${sub} visual piece from the collection archive.`
        ).toLowerCase();

        // Check for dedicated video thumbnail image
        let thumbnail = `/collection/${sub}/${entry.name}`;
        if (isVideo) {
          const thumbFile = `${baseName}-thumb.jpg`;
          const thumbPath = path.join(subPath, thumbFile);
          if (fs.existsSync(thumbPath)) {
            thumbnail = `/collection/${sub}/${thumbFile}`;
          }
        }

        items.push({
          id,
          title,
          category: sub,
          mediaType: isVideo ? "video" : "image",
          src: `/collection/${sub}/${entry.name}`,
          thumbnail,
          filename: entry.name,
          extension: ext,
          year: metadata.year || "2024",
          description,
          tools: metadata.tools?.map((t) => t.toLowerCase()) || [sub],
          aspectRatio: metadata.aspectRatio || "aspect-[16/9]",
        });
      }
    }

    return NextResponse.json(
      { items },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("failed to read collection directory:", err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
