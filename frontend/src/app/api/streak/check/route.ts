import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(
        username
      )}/events?per_page=100`,
      {
        // Public, unauthenticated – fine for low volume, can be upgraded later
        headers: {
          "User-Agent": "devtrack-streak-check",
          Accept: "application/vnd.github+json",
        },
        next: {
          revalidate: 60, // cache for 1 minute to avoid rate limits
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch events from GitHub" },
        { status: 502 }
      );
    }

    const events: any[] = await res.json();

    const today = new Date();
    const todayYear = today.getUTCFullYear();
    const todayMonth = today.getUTCMonth();
    const todayDate = today.getUTCDate();

    const hasCommittedToday = events.some((event) => {
      if (event.type !== "PushEvent") return false;
      const pushedAt = new Date(event.created_at);
      return (
        pushedAt.getUTCFullYear() === todayYear &&
        pushedAt.getUTCMonth() === todayMonth &&
        pushedAt.getUTCDate() === todayDate
      );
    });

    return NextResponse.json({ hasCommittedToday });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error while checking streak" },
      { status: 500 }
    );
  }
}

