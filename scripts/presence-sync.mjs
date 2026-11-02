#!/usr/bin/env node

/**
 * Real-Time Presence Sync Daemon for Antigravity IDE / VS Code
 * 
 * Inspects local editor activity on macOS and streams truthful coding presence
 * to the hosted portfolio API.
 * 
 * Usage:
 *   node scripts/presence-sync.mjs [hosted-url] [secret]
 * 
 * Examples:
 *   node scripts/presence-sync.mjs https://portfolio-hosted.vercel.app
 *   PRESENCE_URL="https://portfolio-hosted.vercel.app" node scripts/presence-sync.mjs
 */

import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

const TARGET_URL = (process.argv[2] || process.env.PRESENCE_URL || "https://portfolio-ebon-one-69.vercel.app").replace(/\/$/, "");
const SECRET = process.argv[3] || process.env.PRESENCE_SYNC_SECRET || process.env.PRESENCE_SECRET || "";
const INTERVAL_MS = parseInt(process.env.PRESENCE_INTERVAL || "10000", 10);
const IDLE_THRESHOLD_MS = 20 * 60 * 1000; // 20 minutes of no edits = idle

const LANG_MAP = {
  ".js": { name: "javascript", phrase: "working with js file" },
  ".jsx": { name: "react / javascript", phrase: "working with jsx file" },
  ".ts": { name: "typescript", phrase: "working with typescript file" },
  ".tsx": { name: "react / typescript", phrase: "working with tsx file" },
  ".py": { name: "python", phrase: "writing python script" },
  ".rs": { name: "rust", phrase: "crafting systems in rust" },
  ".css": { name: "css", phrase: "working with css file" },
  ".scss": { name: "scss", phrase: "styling with scss file" },
  ".html": { name: "html", phrase: "structuring markup in html" },
  ".json": { name: "json", phrase: "configuring json data" },
  ".md": { name: "markdown", phrase: "documenting in markdown" },
  ".sql": { name: "sql", phrase: "querying schemas in sql" },
  ".go": { name: "go", phrase: "building services in go" },
  ".cpp": { name: "c++", phrase: "low-level hacking in c++" },
  ".c": { name: "c", phrase: "low-level hacking in c" },
  ".sh": { name: "shell", phrase: "working with shell script" },
  ".zsh": { name: "zsh", phrase: "working with zsh script" },
  ".yaml": { name: "yaml", phrase: "configuring yaml pipeline" },
  ".yml": { name: "yaml", phrase: "configuring yaml pipeline" },
  ".env": { name: "environment config", phrase: "configuring environment" },
  ".toml": { name: "toml", phrase: "configuring toml file" },
};

function getLocalCodingState() {
  try {
    let ps = "";
    try {
      ps = execSync("ps -axo comm", { timeout: 1500 }).toString();
    } catch {
      return { isCoding: false, editorDisplay: "standby", phrase: "currently away from editor" };
    }

    const isAntigravityRunning = ps.includes("Antigravity IDE") || ps.includes("antigravity");
    const isCodeRunning =
      ps.includes("Visual Studio Code") ||
      ps.includes("Code Helper") ||
      ps.includes("code");
    const isCursorRunning = ps.includes("Cursor") || ps.includes("cursor");

    if (!isAntigravityRunning && !isCodeRunning && !isCursorRunning) {
      return { isCoding: false, editorDisplay: "offline", phrase: "currently away from editor" };
    }

    const home = os.homedir();
    const candidateRoots = [];
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
    let chosenEditor = isAntigravityRunning ? "antigravity" : "vs code";

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

    if (!latestMtime || Date.now() - latestMtime > IDLE_THRESHOLD_MS) {
      return { isCoding: false, editorDisplay: "standby", phrase: "currently away from editor" };
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

          function findLeaves(node) {
            if (!node) return [];
            if (node.type === "leaf" && node.data && typeof node.data === "object") {
              return [node.data];
            }
            if (node.data && Array.isArray(node.data)) {
              return node.data.flatMap(findLeaves);
            }
            return [];
          }

          const leaves = findLeaves(grid?.root);
          for (const leaf of leaves) {
            const mru = leaf.mru || [];
            const editors = leaf.editors || [];
            const topIndex = mru[0] ?? 0;
            const topEditor = editors[topIndex];
            if (topEditor?.value) {
              const val = typeof topEditor.value === "string" ? JSON.parse(topEditor.value) : topEditor.value;
              const p = val?.resourceJSON?.fsPath || val?.resourceJSON?.path || "";
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
      return { isCoding: false, editorDisplay: "standby", phrase: "currently away from editor" };
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
      sessionStartedAt: new Date(latestMtime).toISOString(),
    };
  } catch {
    return { isCoding: false, editorDisplay: "standby", phrase: "currently away from editor" };
  }
}

async function sendPresencePing(payload) {
  const endpoint = `${TARGET_URL}/api/presence`;
  const headers = {
    "Content-Type": "application/json",
  };
  if (SECRET) {
    headers["x-presence-secret"] = SECRET;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }

  return await res.json();
}

async function tick() {
  const timeStr = new Date().toLocaleTimeString();
  const state = getLocalCodingState();

  try {
    await sendPresencePing(state);
    if (state.isCoding) {
      console.log(
        `[${timeStr}] 🟢 Synced Coding: [${state.editorDisplay}] ${state.extension || ""} (${state.phrase}) -> ${TARGET_URL}`
      );
    } else {
      console.log(
        `[${timeStr}] ⚪ Synced Idle: (${state.editorDisplay} • ${state.phrase}) -> ${TARGET_URL}`
      );
    }
  } catch (err) {
    console.warn(`[${timeStr}] ⚠️  Failed to sync to ${TARGET_URL}: ${err.message}`);
  }
}

console.log("==================================================");
console.log("🚀 Real-Time Coding Presence Sync");
console.log(`📡 Target endpoint: ${TARGET_URL}/api/presence`);
console.log(`⏱️  Sync interval : ${INTERVAL_MS / 1000}s`);
console.log(`🔒 Secret header : ${SECRET ? "enabled" : "none"}`);
console.log("Press Ctrl+C at any time to disconnect and set status to Standby.");
console.log("==================================================\n");

// Initial sync tick
tick();
const timer = setInterval(tick, INTERVAL_MS);

// Graceful cleanup on shutdown
async function handleExit() {
  clearInterval(timer);
  console.log("\n🛑 Stopping presence sync, reporting standby state...");
  try {
    await sendPresencePing({
      isCoding: false,
      editor: null,
      editorDisplay: "standby",
      language: null,
      extension: null,
      phrase: "currently away from editor",
    });
    console.log("✅ Site status updated to Standby.");
  } catch {}
  process.exit(0);
}

process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);

