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

        // Fetch User Data
        const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
        if (!userRes.ok) {
           return NextResponse.json({ 
               error: "Failed to fetch GitHub profile", 
               status: userRes.status,
               message: userRes.status === 403 ? "Rate limit exceeded. Please sign in or try again later." : "User not found"
           }, { status: userRes.status });
        }
        const userData = await userRes.json();

        // Fetch Recent Repos (updated sort, more items for leaderboard)
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, { headers });
        const reposData = reposRes.ok ? await reposRes.json() : [];

        return NextResponse.json({
            userData,
            reposData
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
    }
}
