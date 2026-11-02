import { NextResponse } from "next/server";
import { SOCIAL_LINKS } from "../../../data/portfolio-data";

export const dynamic = "force-dynamic";

interface AnimeStatsResponse {
  username: string;
  avatarUrl?: string;
  profileUrl: string;
  totalCompleted: number;
  currentlyWatching: number;
  totalEntries: number;
  episodesWatched: number;
  daysWatched: number;
  meanScore: number;
  isLive: boolean;
  message?: string;
}

const FALLBACK_STATS: AnimeStatsResponse = {
  username: SOCIAL_LINKS.anilistUser || "spideykun05",
  profileUrl: `https://anilist.co/user/${SOCIAL_LINKS.anilistUser || "spideykun05"}`,
  totalCompleted: 146,
  currentlyWatching: 16,
  totalEntries: 167,
  episodesWatched: 5253,
  daysWatched: 72.3,
  meanScore: 90.2,
  isLive: false,
  message: "Displaying cached / preview anime collection statistics.",
};

const ANILIST_QUERY = `
query ($username: String) {
  User(name: $username) {
    id
    name
    siteUrl
    avatar {
      large
      medium
    }
    statistics {
      anime {
        count
        meanScore
        minutesWatched
        episodesWatched
        statuses {
          status
          count
        }
      }
    }
  }
}
`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username =
    searchParams.get("username") ||
    process.env.ANILIST_USERNAME ||
    SOCIAL_LINKS.anilistUser ||
    "mayanks0ni";

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: ANILIST_QUERY,
        variables: { username },
      }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json(FALLBACK_STATS, { status: 200 });
    }

    const data = await res.json();
    const user = data?.data?.User;

    if (!user) {
      return NextResponse.json(FALLBACK_STATS, { status: 200 });
    }

    const animeStats = user.statistics?.anime;
    const statuses = animeStats?.statuses || [];

    const completed =
      statuses.find((s: { status: string; count: number }) => s.status === "COMPLETED")?.count ??
      animeStats?.count ??
      0;
    const watching =
      statuses.find((s: { status: string; count: number }) => s.status === "CURRENT")?.count ?? 0;
    const minutesWatched = animeStats?.minutesWatched || 0;
    const daysWatched = Number((minutesWatched / 1440).toFixed(1));

    const responseData: AnimeStatsResponse = {
      username: user.name,
      avatarUrl: user.avatar?.large || user.avatar?.medium,
      profileUrl: user.siteUrl || `https://anilist.co/user/${username}`,
      totalCompleted: completed,
      currentlyWatching: watching,
      totalEntries: animeStats?.count || 0,
      episodesWatched: animeStats?.episodesWatched || 0,
      daysWatched,
      meanScore: animeStats?.meanScore || 0,
      isLive: true,
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("AniList API fetch error:", err);
    return NextResponse.json(FALLBACK_STATS, { status: 200 });
  }
}

