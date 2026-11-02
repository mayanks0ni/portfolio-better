import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";
import {
  PresenceData,
  LANG_MAP,
  getIdleResponse,
  parseLanyardData,
} from "@/lib/presence";

export const dynamic = "force-dynamic";

export type PresenceResponse = PresenceData;

declare global {
  var __liveCodingPresence:
    | {
        data: PresenceResponse;
        timestamp: number;
      }
    | undefined;
}

async function getUpstashPresence(): Promise<PresenceResponse | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/get/live_coding_presence`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.result) {
      const parsed = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
      return parsed as PresenceResponse;
    }
  } catch {
    // ignore
  }
  return null;
}

async function fetchLanyardPresence(discordId: string): Promise<PresenceResponse | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`, {
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" },
      next: { revalidate: 0 },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.success || !json?.data) return null;

    return parseLanyardData(json.data);
  } catch {
    return null;
  }
}

function detectLocalEditorActivity(): PresenceResponse | null {
  try {
    let ps = "";
    try {
      ps = execSync("ps -axo comm", { timeout: 1500 }).toString();
    } catch {
      return null;
    }

    const isAntigravityRunning = ps.includes("Antigravity IDE") || ps.includes("antigravity");
    const isCodeRunning =
      ps.includes("Visual Studio Code") ||
      ps.includes("Code Helper") ||
      ps.includes("code");
    const isCursorRunning = ps.includes("Cursor") || ps.includes("cursor");

    if (!isAntigravityRunning && !isCodeRunning && !isCursorRunning) {
      return getIdleResponse("offline");
    }

    const home = os.homedir();
    const candidateRoots: { root: string; type: "antigravity" | "vs code" }[] = [];
    if (isAntigravityRunning) {
      candidateRoots.push({
        root: path.join(home, "Library/Application Support/Antigravity IDE/User/workspaceStorage"),
        type: "antigravity",
      });
    }
    if (isCodeRunning) {
      candidateRoots.push({
        root: path.join(home, "Library/Application Support/Code/User/workspaceStorage"),
        type: "vs code",
      });
    }
    if (isCursorRunning) {
      candidateRoots.push({
        root: path.join(home, "Library/Application Support/Cursor/User/workspaceStorage"),
        type: "vs code",
      });
    }

    let mostRecentDir = "";
    let latestMtime = 0;
    let chosenEditor: "antigravity" | "vs code" = isAntigravityRunning ? "antigravity" : "vs code";

    for (const { root, type } of candidateRoots) {
      if (!fs.existsSync(root)) continue;
      try {
        const dirs = fs.readdirSync(root);
        for (const d of dirs) {
          const full = path.join(root, d);
          try {
            const db = path.join(full, "state.vscdb");
            if (fs.existsSync(db)) {
              const dbStat = fs.statSync(db);
              if (dbStat.mtimeMs > latestMtime) {
                latestMtime = dbStat.mtimeMs;
                mostRecentDir = full;
                chosenEditor = type;
              }
            }
          } catch {}
        }
      } catch {}
    }

    // Idle threshold: if workspace hasn't been touched in over 20 minutes, user is AFK/idle
    const IDLE_THRESHOLD_MS = 20 * 60 * 1000;
    if (!latestMtime || Date.now() - latestMtime > IDLE_THRESHOLD_MS) {
      return getIdleResponse("standby");
    }

    let activePath = "";
    if (mostRecentDir) {
      const db = path.join(mostRecentDir, "state.vscdb");
      try {
        const raw = execSync(
          `sqlite3 "${db}" "SELECT value FROM ItemTable WHERE key='memento/workbench.parts.editor';" 2>/dev/null`,
          { timeout: 1500 }
        ).toString();

        if (raw.trim()) {
          const parsed = JSON.parse(raw);
          const grid = parsed["editorpart.state"]?.serializedGrid;

          interface SerializedNode {
            type?: string;
            data?: unknown;
          }

          function findLeaves(node?: SerializedNode): Record<string, unknown>[] {
            if (!node) return [];
            if (node.type === "leaf" && node.data && typeof node.data === "object") {
              return [node.data as Record<string, unknown>];
            }
            if (node.data && Array.isArray(node.data)) {
              return (node.data as SerializedNode[]).flatMap(findLeaves);
            }
            return [];
          }

          const leaves = findLeaves(grid?.root as SerializedNode | undefined);
          for (const leaf of leaves) {
            const mru = (leaf.mru as number[]) || [];
            const editors = (leaf.editors as Record<string, unknown>[]) || [];
            const topIndex = mru[0] ?? 0;
            const topEditor = editors[topIndex];
            if (topEditor?.value) {
              const val = typeof topEditor.value === "string" ? JSON.parse(topEditor.value) : topEditor.value;
              const p =
                (val as { resourceJSON?: { fsPath?: string; path?: string } })?.resourceJSON?.fsPath ||
                (val as { resourceJSON?: { fsPath?: string; path?: string } })?.resourceJSON?.path ||
                "";
              if (p) {
                activePath = p;
                break;
              }
            }
          }
        }
      } catch {}
    }

    if (!activePath) {
      return getIdleResponse("standby");
    }

    const ext = path.extname(activePath).toLowerCase();
    const matchedLang = ext ? LANG_MAP[ext] : null;

    const languageName = matchedLang
      ? matchedLang.name
      : ext
      ? ext.replace(".", "")
      : "source code";

    const phrase = matchedLang
      ? matchedLang.phrase
      : ext
      ? `working with ${ext.replace(".", "")} file`
      : "coding in active session";

    return {
      isCoding: true,
      editor: chosenEditor,
      editorDisplay: chosenEditor === "antigravity" ? "antigravity ide" : "visual studio code",
      language: languageName,
      extension: ext || null,
      phrase,
      status: "active",
      statusText: "coding right now",
      sessionStartedAt: new Date(latestMtime).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function GET() {
  // 1. Explicit override check (for debugging or manual setting)
  if (process.env.CODING_PRESENCE_OVERRIDE) {
    try {
      const parsed = JSON.parse(process.env.CODING_PRESENCE_OVERRIDE);
      return NextResponse.json(parsed, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    } catch {}
  }

  // 2. In-memory heartbeat cache (updated within the last 120 seconds)
  if (globalThis.__liveCodingPresence) {
    const age = Date.now() - globalThis.__liveCodingPresence.timestamp;
    if (age < 120_000) {
      return NextResponse.json(globalThis.__liveCodingPresence.data, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }
  }

  // 3. Upstash / KV store (cross-instance serverless cache)
  const upstashData = await getUpstashPresence();
  if (upstashData) {
    return NextResponse.json(upstashData, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }

  // 4. Lanyard Discord Presence (queries real Discord RPC if user joined discord.gg/lanyard)
  const discordId = process.env.DISCORD_USER_ID || "516247416878530560";
  const lanyard = await fetchLanyardPresence(discordId);
  if (lanyard) {
    return NextResponse.json(lanyard, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }

  // 5. Local macOS inspection (used in local development on Mac)
  if (process.platform === "darwin" && !process.env.VERCEL) {
    const local = detectLocalEditorActivity();
    if (local) {
      return NextResponse.json(local, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }
  }

  // 6. Truthful default idle/standby state (NEVER a fake demo session!)
  return NextResponse.json(getIdleResponse("standby"), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("x-presence-secret") || req.headers.get("authorization");
    const secret = process.env.PRESENCE_SYNC_SECRET;
    if (secret && authHeader !== secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const isCoding = Boolean(body.isCoding);

    const payload: PresenceResponse = {
      isCoding,
      editor: body.editor === "antigravity" ? "antigravity" : body.editor === "vs code" ? "vs code" : null,
      editorDisplay: body.editorDisplay || (isCoding ? "active editor" : "standby"),
      language: isCoding ? body.language || null : null,
      extension: isCoding ? body.extension || null : null,
      phrase: isCoding ? body.phrase || "coding in active session" : "currently away from editor",
      status: isCoding ? "active" : "idle",
      statusText: isCoding ? "coding right now" : "not coding right now",
      sessionStartedAt: isCoding ? (body.sessionStartedAt || new Date().toISOString()) : undefined,
      updatedAt: new Date().toISOString(),
    };

    globalThis.__liveCodingPresence = {
      data: payload,
      timestamp: Date.now(),
    };

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (redisUrl && redisToken) {
      try {
        await fetch(`${redisUrl}/set/live_coding_presence?ex=120`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${redisToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("failed to save presence to Redis:", err);
      }
    }

    return NextResponse.json({ success: true, presence: payload });
  } catch (err) {
    return NextResponse.json({ error: "bad request", message: String(err) }, { status: 400 });
  }
}
