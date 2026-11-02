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
};

function detectLocalEditorActivity(): PresenceResponse | null {
  try {
    let ps = "";
    try {
      ps = execSync("ps -axo comm", { timeout: 1500 }).toString();
    } catch {
      return null;
    }

    const isAntigravityRunning = ps.includes("Antigravity IDE");
    const isCodeRunning =
      ps.includes("Visual Studio Code") ||
      ps.includes("Code Helper") ||
      ps.includes("code");

    if (!isAntigravityRunning && !isCodeRunning) {
      return {
        isCoding: false,
        editor: null,
        editorDisplay: "offline",
        language: null,
        extension: null,
        phrase: "away from keyboard // idle",
        status: "idle",
        statusText: "not coding right now",
        updatedAt: new Date().toISOString(),
      };
    }

    const editorType = isAntigravityRunning ? "antigravity" : "vs code";

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

    let mostRecentDir = "";
    let latestMtime = 0;
    let chosenEditor: "antigravity" | "vs code" = editorType;

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
              const p = (val as { resourceJSON?: { fsPath?: string; path?: string } })?.resourceJSON?.fsPath ||
                        (val as { resourceJSON?: { fsPath?: string; path?: string } })?.resourceJSON?.path || "";
              if (p) {
                activePath = p;
                break;
              }
            }
          }
        }
      } catch {}
    }

    // Extract file extension without exposing directory, repo, or filename
    const ext = activePath ? path.extname(activePath).toLowerCase() : "";
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
      sessionStartedAt: latestMtime ? new Date(latestMtime).toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function GET() {
  // Check override for remote deployment testing if configured
  if (process.env.CODING_PRESENCE_OVERRIDE) {
    try {
      const parsed = JSON.parse(process.env.CODING_PRESENCE_OVERRIDE);
      return NextResponse.json(parsed, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    } catch {}
  }

  // Attempt real-time local editor inspection (Mac / Antigravity IDE / VS Code)
  const localActivity = detectLocalEditorActivity();
  if (localActivity) {
    return NextResponse.json(localActivity, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }

  // Fallback state if server cannot inspect local processes (e.g. running in cloud serverless)
  const fallback: PresenceResponse = {
    isCoding: true,
    editor: "antigravity",
    editorDisplay: "antigravity ide",
    language: "typescript",
    extension: ".ts",
    phrase: "working with typescript file",
    status: "active",
    statusText: "coding right now",
    sessionStartedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(fallback, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
