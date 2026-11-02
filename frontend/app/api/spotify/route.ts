import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SpotifyTrackResponse {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  playedAt?: string;
  isConfigured: boolean;
  message?: string;
}

const FALLBACK_TRACK: SpotifyTrackResponse = {
  isPlaying: false,
  title: "After Hours",
  artist: "The Weeknd",
  album: "After Hours",
  albumImageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
  songUrl: "https://open.spotify.com",
  isConfigured: false,
  message: "Spotify API credentials not configured yet in .env.local",
};

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh Spotify access token: ${response.statusText}`);
  }

  return response.json();
}

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  // Graceful fallback if credentials are not configured yet
  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json(FALLBACK_TRACK, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  }

  try {
    const { access_token } = await getAccessToken(clientId, clientSecret, refreshToken);

    // 1. Check currently playing
    const nowPlayingRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    });

    if (nowPlayingRes.status === 200) {
      const song = await nowPlayingRes.json();
      if (song && song.item) {
        const trackData: SpotifyTrackResponse = {
          isPlaying: song.is_playing ?? false,
          title: song.item.name,
          artist: song.item.artists.map((_artist: { name: string }) => _artist.name).join(", "),
          album: song.item.album.name,
          albumImageUrl: song.item.album.images?.[0]?.url || FALLBACK_TRACK.albumImageUrl,
          songUrl: song.item.external_urls.spotify,
          isConfigured: true,
        };

        return NextResponse.json(trackData, {
          headers: {
            "Cache-Control": "public, s-maxage=15, stale-while-revalidate=10",
          },
        });
      }
    }

    // 2. If nothing currently playing, fetch recently played
    const recentRes = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    });

    if (recentRes.ok) {
      const recent = await recentRes.json();
      if (recent.items && recent.items.length > 0) {
        const item = recent.items[0];
        const trackData: SpotifyTrackResponse = {
          isPlaying: false,
          title: item.track.name,
          artist: item.track.artists.map((_artist: { name: string }) => _artist.name).join(", "),
          album: item.track.album.name,
          albumImageUrl: item.track.album.images?.[0]?.url || FALLBACK_TRACK.albumImageUrl,
          songUrl: item.track.external_urls.spotify,
          playedAt: item.played_at,
          isConfigured: true,
        };

        return NextResponse.json(trackData, {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
          },
        });
      }
    }

    return NextResponse.json(FALLBACK_TRACK);
  } catch (err) {
    console.error("Spotify API error:", err);
    return NextResponse.json(FALLBACK_TRACK);
  }
}
