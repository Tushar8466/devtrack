import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const username = req.nextUrl.searchParams.get("username");
    if (!username) {
        return NextResponse.json({ error: "username is required" }, { status: 400 });
    }

    try {
        // Fetch the public GitHub contributions page
        const res = await fetch(`https://github.com/users/${username}/contributions`, {
            headers: { "Accept": "text/html" },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch contributions" }, { status: res.status });
        }

        const html = await res.text();

        // Parse contribution data from the HTML
        // Each contribution cell looks like: <td ... data-date="2024-03-10" data-level="2" ...>
        const contributions: { date: string; count: number; level: number }[] = [];
        let totalContributions = 0;

        // Extract data-date and data-level from td elements
        const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
        let match;
        while ((match = cellRegex.exec(html)) !== null) {
            const date = match[1];
            const level = parseInt(match[2], 10);
            // Approximate count from level: 0=0, 1=1-3, 2=4-6, 3=7-9, 4=10+
            const approxCounts = [0, 2, 5, 8, 12];
            const count = approxCounts[level] || 0;
            totalContributions += count;
            contributions.push({ date, count, level });
        }

        // Also try to extract actual total from the page
        // Pattern: "1,234 contributions in the last year" or similar
        const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
        if (totalMatch) {
            totalContributions = parseInt(totalMatch[1].replace(/,/g, ""), 10);
        }

        return NextResponse.json({
            username,
            totalContributions,
            contributions,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
    }
}
