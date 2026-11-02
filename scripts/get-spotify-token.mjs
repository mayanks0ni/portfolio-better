#!/usr/bin/env node

/**
 * Spotify OAuth Refresh Token Generator for Mayank Soni Portfolio
 *
 * Automatically opens Spotify authorization page, catches the callback,
 * exchanges for a permanent refresh token, and saves it into .env / .env.local.
 */

import http from "http";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "../frontend/.env");
const envLocalPath = path.join(__dirname, "../frontend/.env.local");

// Load .env
function loadEnv() {
  const target = fs.existsSync(envLocalPath) ? envLocalPath : envPath;
  if (!fs.existsSync(target)) {
    console.error("❌ Could not find frontend/.env or frontend/.env.local");
    process.exit(1);
  }

  const raw = fs.readFileSync(target, "utf8");
  const parsed = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      parsed[match[1]] = value.trim();
    }
  }
  return parsed;
}

const env = loadEnv();
let clientId = env.SPOTIFY_CLIENT_ID;
const clientSecret = env.SPOTIFY_CLIENT_SECRET;

// Fix possible leading 'y' if present
if (clientId && clientId.length === 33 && clientId.startsWith("y")) {
  clientId = clientId.slice(1);
}

if (!clientId || !clientSecret) {
  console.error("❌ Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in frontend/.env");
  process.exit(1);
}

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ["user-read-currently-playing", "user-read-recently-played"].join(" ");

const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${encodeURIComponent(SCOPES)}`;

console.log("\n==================================================");
console.log("🎵 Spotify Refresh Token Helper");
console.log("==================================================");
console.log(`\nUsing Client ID:     ${clientId}`);
console.log(`Redirect URI:        ${REDIRECT_URI}`);
console.log("\n📌 IMPORTANT: Ensure this Redirect URI is added in your Spotify Dashboard:");
console.log(`   👉 ${REDIRECT_URI}\n`);

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (reqUrl.pathname === "/callback") {
    const code = reqUrl.searchParams.get("code");
    const error = reqUrl.searchParams.get("error");

    if (error) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end(`<h1>Spotify Authorization Error</h1><p>${error}</p>`);
      console.error(`\n❌ Authorization failed: ${error}`);
      server.close();
      process.exit(1);
    }

    if (!code) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end("<h1>Missing authorization code</h1>");
      return;
    }

    try {
      console.log("⚡ Exchanging authorization code with Spotify API...");
      const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      const data = await tokenRes.json();

      if (!data.refresh_token) {
        throw new Error(data.error_description || JSON.stringify(data));
      }

      const refreshToken = data.refresh_token;

      // Update .env and .env.local
      for (const file of [envPath, envLocalPath]) {
        if (fs.existsSync(file)) {
          let content = fs.readFileSync(file, "utf8");
          if (content.includes("SPOTIFY_REFRESH_TOKEN=")) {
            content = content.replace(
              /SPOTIFY_REFRESH_TOKEN=.*/g,
              `SPOTIFY_REFRESH_TOKEN=${refreshToken}`
            );
          } else {
            content += `\nSPOTIFY_REFRESH_TOKEN=${refreshToken}\n`;
          }
          fs.writeFileSync(file, content, "utf8");
          console.log(`✅ Saved refresh token to ${path.basename(file)}`);
        }
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <div style="background:#08090D;color:#F4F2ED;font-family:sans-serif;padding:40px;text-align:center;">
          <h1 style="color:#C6F36B;">Spotify Telemetry Connected!</h1>
          <p>Refresh token has been automatically saved to your .env files.</p>
          <p>You can close this tab and return to your terminal / browser.</p>
        </div>
      `);

      console.log("\n🎉 SUCCESS! Your Spotify Refresh Token is:");
      console.log(`\n${refreshToken}\n`);
      console.log("Your portfolio will now display live listening telemetry.");

      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 1000);
    } catch (err) {
      console.error("\n❌ Token exchange error:", err.message);
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end(`<h1>Error</h1><p>${err.message}</p>`);
      server.close();
      process.exit(1);
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Listening for Spotify callback on port ${PORT}...`);
  console.log("\nOpening browser for Spotify authorization...\n");
  exec(`open "${authUrl}"`);
});

