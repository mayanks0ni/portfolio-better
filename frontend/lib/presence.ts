export interface PresenceData {
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

export const LANG_MAP: Record<string, { name: string; phrase: string; icon: string; color: string }> = {
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

export function getIdlePresence(reason = "standby"): PresenceData {
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

export const getIdleResponse = getIdlePresence;

export interface LanyardActivity {
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

export function parseLanyardData(data: { discord_status?: string; activities?: LanyardActivity[] } | null | undefined): PresenceData | null {
  if (!data || !data.discord_status) return null;
  const activities = Array.isArray(data.activities) ? data.activities : [];

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
  const state = codingActivity.state || "";

  let ext = "";
  const fileMatch = `${details} ${state}`.match(/\.([a-zA-Z0-9_-]+)(?:\s|$|:)/);
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
  } else if (state) {
    phrase = state.toLowerCase();
  } else {
    phrase = "working with code";
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
}
