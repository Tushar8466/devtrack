import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    const currentYear = new Date().getFullYear();
    const yearsToFetch = [currentYear, currentYear - 1];
    const datesWithActivity = new Set<string>();

    await Promise.all(
      yearsToFetch.map(async (year) => {
        const from = `${year}-01-01`;
        const to =
          year === currentYear
            ? new Date().toISOString().split("T")[0]
            : `${year}-12-31`;

        const res = await fetch(
          `https://github.com/users/${username}/contributions?from=${from}&to=${to}`,
          { headers: { Accept: "text/html" }, next: { revalidate: 300 } }
        );
        if (!res.ok) return;

        const html = await res.text();
        const cellRegex =
          /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([1-4])"/g;
        let match;
        while ((match = cellRegex.exec(html)) !== null) {
          datesWithActivity.add(match[1]);
        }
      })
    );

    // Group by year-month
    const monthMap: Record<string, number> = {};
    for (const dateStr of datesWithActivity) {
      const [yearStr, monthStr] = dateStr.split("-");
      const key = `${yearStr}-${monthStr}`;
      monthMap[key] = (monthMap[key] || 0) + 1;
    }

    const MONTH_NAMES = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];

    // Build a sorted list of the last 14 months
    const now = new Date();
    const monthly: { month: string; year: number; count: number }[] = [];

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth(); // 0-indexed
      const key = `${y}-${String(m + 1).padStart(2, "0")}`;
      monthly.push({
        month: MONTH_NAMES[m],
        year: y,
        count: monthMap[key] || 0,
      });
    }

    return NextResponse.json({ monthly });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
