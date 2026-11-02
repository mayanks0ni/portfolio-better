import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return new NextResponse(
      `<div style="font-family: monospace; background: #08090D; color: #FF6B6B; padding: 40px; text-align: center;">
        <h2>Spotify Authorization Denied</h2>
        <p>${error}</p>
        <a href="/" style="color: #F3B73E;">Return to Portfolio</a>
      </div>`,
      { headers: { "Content-Type": "text/html" }, status: 400 }
    );
  }

  if (!code) {
    return new NextResponse("Authorization code missing in callback", {
      status: 400,
    });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = "http://127.0.0.1:3000/api/spotify/callback";

  if (!clientId || !clientSecret) {
    return new NextResponse("Spotify client ID or secret missing in environment", {
      status: 500,
    });
  }

  try {
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
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return new NextResponse(`Spotify token exchange error: ${errText}`, {
        status: 400,
      });
    }

    const data = await tokenRes.json();
    const refreshToken = data.refresh_token;

    if (!refreshToken) {
      return new NextResponse(
        "No refresh_token returned by Spotify. Make sure user-read scopes were requested.",
        { status: 500 }
      );
    }

    // Automatically update .env and .env.local on disk
    const envPaths = [
      path.join(process.cwd(), ".env"),
      path.join(process.cwd(), ".env.local"),
    ];

    for (const envPath of envPaths) {
      if (fs.existsSync(envPath)) {
        let content = fs.readFileSync(envPath, "utf8");
        if (content.includes("SPOTIFY_REFRESH_TOKEN=")) {
          content = content.replace(
            /SPOTIFY_REFRESH_TOKEN=.*/g,
            `SPOTIFY_REFRESH_TOKEN=${refreshToken}`
          );
        } else {
          content += `\nSPOTIFY_REFRESH_TOKEN=${refreshToken}\n`;
        }
        fs.writeFileSync(envPath, content, "utf8");
      }
    }

    // Return polished success page
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Spotify Connected — Mayank Soni</title>
      <style>
        body {
          background-color: #08090D;
          color: #F4F2ED;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background: #101219;
          border: 1px solid #292C37;
          border-radius: 24px;
          padding: 40px;
          max-width: 480px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        }
        .badge {
          display: inline-block;
          background: rgba(243, 183, 62, 0.15);
          color: #F3B73E;
          border: 1px solid rgba(243, 183, 62, 0.35);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 24px;
          margin: 0 0 12px 0;
          font-weight: 700;
        }
        p {
          color: #9296A3;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .token-box {
          background: #171A24;
          border: 1px solid #292C37;
          border-radius: 12px;
          padding: 12px;
          font-size: 11px;
          word-break: break-all;
          color: #F3B73E;
          margin-bottom: 28px;
          text-align: left;
        }
        a.btn {
          display: inline-block;
          background: #F3B73E;
          color: #08090D;
          font-weight: 700;
          padding: 12px 28px;
          border-radius: 9999px;
          text-decoration: none;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">OAUTH 2.0 GRANTED</div>
        <h1>Spotify Telemetry Connected</h1>
        <p>The authorization code was exchanged and your <strong>Spotify Refresh Token</strong> has been automatically written to <code>.env</code> and <code>.env.local</code>.</p>
        <div class="token-box">
          SPOTIFY_REFRESH_TOKEN=${refreshToken.slice(0, 10)}...${refreshToken.slice(-10)}
        </div>
        <a href="/" class="btn">Return to Portfolio</a>
      </div>
    </body>
    </html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
      status: 200,
    });
  } catch (err) {
    console.error("Callback error:", err);
    return new NextResponse("Internal server error during Spotify authorization", {
      status: 500,
    });
  }
}

