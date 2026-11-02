import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    return new NextResponse("SPOTIFY_CLIENT_ID is not configured in .env", {
      status: 400,
    });
  }

  // Spotify explicitly requires 127.0.0.1 instead of localhost for local loopback
  const redirectUri =
    searchParams.get("redirect_uri") || "http://127.0.0.1:3000/api/spotify/callback";

  const scopes = ["user-read-currently-playing", "user-read-recently-played"].join(" ");

  const spotifyAuthUrl = new URL("https://accounts.spotify.com/authorize");
  spotifyAuthUrl.searchParams.set("client_id", clientId);
  spotifyAuthUrl.searchParams.set("response_type", "code");
  spotifyAuthUrl.searchParams.set("redirect_uri", redirectUri);
  spotifyAuthUrl.searchParams.set("scope", scopes);

  return NextResponse.redirect(spotifyAuthUrl.toString());
}
