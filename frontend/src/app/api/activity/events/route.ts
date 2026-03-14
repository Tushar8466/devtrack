import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    const accessToken = (session as any)?.accessToken;

    const headers: HeadersInit = {
      "Accept": "application/vnd.github+json",
    };

    if (accessToken) {
      headers["Authorization"] = `token ${accessToken}`;
    }

    const res = await fetch(`https://api.github.com/users/${username}/events/public?per_page=10`, { headers });
    
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch events" }, { status: res.status });
    }

    const events = await res.json();
    
    // Map to a simpler format
    const formattedEvents = events.map((event: any) => ({
      id: event.id,
      type: event.type,
      repo: event.repo.name,
      createdAt: event.created_at,
      payload: {
        action: event.payload.action,
        commits: event.payload.commits?.length || 0,
        ref: event.payload.ref,
        refType: event.payload.ref_type,
      }
    }));

    return NextResponse.json({ events: formattedEvents });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
