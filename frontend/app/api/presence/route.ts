import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

export interface PresenceResponse {
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

declare global {
  var __liveCodingPresence:
    | {
        data: PresenceResponse;
        timestamp: number;
      }
    | undefined;
}

const LANG_MAP: Record<string, { name: string; phrase: string; icon: string; color: string }> = {
  ".js": { name: "javascript", phrase: "working with js file", icon: "js", color: "#f7df1e" },
  ".jsx": { name: "react / javascript", phrase: "working with jsx file", icon: "react", color: "#61dafb" },
  ".ts": { name: "typescript", phrase: "working with typescript file", icon: "ts", color: "#3178c6" },
  ".tsx": { name: "react / typescript", phrase: "working with tsx file", icon: "react", color: "#61dafb" },
  ".py": { name: "python", phrase: "writing python script", icon: "python", color: "#3776ab" },
  ".rs": { name: "rust", phrase: "crafting systems in rust", icon: "rust", color: "#dea584" },
  ".css": { name: "css", phrase: "working with css file", icon: "css", color: "#264de4" },
  ".scss": { name: "scss", phrase: "styling with scss file", icon: "scss", color: "#cc6699" },
  ".html": { name: "html", phrase: "structuring markup in html", icon: "html", color: "#e34f26" },
  ".json": { name: "json", phrase: "configuring json data", icon: "json", color: "#cbcb41" },
  ".md": { name: "markdown", phrase: "documenting in markdown", icon: "markdown", color: "#083fa1" },
  ".sql": { name: "sql", phrase: "querying schemas in sql", icon: "sql", color: "#e38c00" },
  ".go": { name: "go", phrase: "building services in go", icon: "go", color: "#00add8" },
  ".cpp": { name: "c++", phrase: "low-level hacking in c++", icon: "cpp", color: "#00599c" },
  ".c": { name: "c", phrase: "low-level hacking in c", icon: "c", color: "#555555" },
  ".sh": { name: "shell", phrase: "working with shell script", icon: "shell", color: "#89e051" },
  ".zsh": { name: "zsh", phrase: "working with zsh script", icon: "shell", color: "#89e051" },
  ".yaml": { name: "yaml", phrase: "configuring yaml pipeline", icon: "yaml", color: "#cb171e" },
  ".yml": { name: "yaml", phrase: "configuring yaml pipeline", icon: "yaml", color: "#cb171e" },
  ".env": { name: "environment config", phrase: "configuring environment", icon: "env", color: "#16a34a" },
  ".toml": { name: "toml", phrase: "configuring toml file", icon: "toml", color: "#9c4221" },
};

function getIdleResponse(reason = "standby"): PresenceResponse {
  return {
    isCoding: false,
    editor: null,
    editorDisplay: reason,
    language: null,
    extension: null,
    phrase: "currently away from editor",
    status: "idle",
    statusText: "not coding right now",
    updatedAt: new Date().toISOString(),
  };
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

interface LanyardActivity {
  type: number;
  name?: string;
  details?: string;
  state?: string;
  timestamps?: { start?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
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

    const data = json.data;
    const activities: LanyardActivity[] = Array.isArray(data.activities) ? data.activities : [];

    const codingActivity = activities.find((act) => {
      const name = (act.name || "").toLowerCase();
      return (
        name.includes("visual studio code") ||
        name.includes("antigravity") ||
        name.includes("code") ||
        name.includes("cursor") ||
        name.includes("neovim") ||
        name.includes("vim") ||
        name.includes("webstorm") ||
        name.includes("intellij")
      );
    });

    if (!codingActivity) {
      return {
        isCoding: false,
        editor: null,
        editorDisplay: data.discord_status === "offline" ? "offline" : "standby",
        language: null,
        extension: null,
        phrase: "currently away from editor",
        status: "idle",
        statusText: "not coding right now",
        updatedAt: new Date().toISOString(),
      };
    }

    const actName = (codingActivity.name || "").toLowerCase();
    const isAntigravity = actName.includes("antigravity");
    const editor: "antigravity" | "vs code" = isAntigravity ? "antigravity" : "vs code";
    const editorDisplay = isAntigravity
      ? "antigravity ide"
      : actName.includes("cursor")
      ? "cursor"
      : "visual studio code";

    const details = codingActivity.details || "";
    let ext = "";
    const fileMatch = details.match(/\.([a-zA-Z0-9_-]+)(?:\s|$|:)/);
    if (fileMatch) {
      ext = `.${fileMatch[1].toLowerCase()}`;
    }

    const assetSmallText = (codingActivity.assets?.small_text || "").toLowerCase();
    const assetLargeText = (codingActivity.assets?.large_text || "").toLowerCase();

    let langName = "";
    if (ext && LANG_MAP[ext]) {
      langName = LANG_MAP[ext].name;
    } else if (assetSmallText && !assetSmallText.includes("code") && !assetSmallText.includes("editing")) {
      langName = assetSmallText;
    } else if (assetLargeText && !assetLargeText.includes("visual studio") && !assetLargeText.includes("code")) {
      langName = assetLargeText;
    } else if (details.toLowerCase().includes("editing ")) {
      langName = details.replace(/editing /i, "").trim();
    } else {
      langName = "source code";
    }

    let phrase = "";
    if (ext && LANG_MAP[ext]) {
      phrase = LANG_MAP[ext].phrase;
    } else if (details) {
      phrase = details.toLowerCase();
    } else {
      phrase = "coding in active session";
    }

    const sessionStart = codingActivity.timestamps?.start
      ? new Date(codingActivity.timestamps.start).toISOString()
      : new Date().toISOString();

    return {
      isCoding: true,
      editor,
      editorDisplay,
      language: langName,
      extension: ext || null,
      phrase,
      status: "active",
      statusText: "coding right now",
      sessionStartedAt: sessionStart,
      updatedAt: new Date().toISOString(),
    };
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
            const stat = fs.statSync(full);
            if (stat.isDirectory() && stat.mtimeMs > latestMtime) {
              const db = path.join(full, "state.vscdb");
              if (fs.existsSync(db)) {
                latestMtime = stat.mtimeMs;
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
