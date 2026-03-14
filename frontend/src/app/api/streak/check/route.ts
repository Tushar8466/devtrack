import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const localDateStr = searchParams.get("localDate"); // Expected YYYY-MM-DD
  const offset = parseInt(searchParams.get("offset") || "0"); // in minutes

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    // GitHub's contribution page only returns ~1 year of data by default.
    // To support long streaks that span multiple years, we fetch the current year
    // AND the previous year, then merge all active dates together.
    const currentYear = new Date().getFullYear();
    const yearsToFetch = [currentYear, currentYear - 1];

    const datesWithActivity = new Set<string>();

    await Promise.all(
      yearsToFetch.map(async (year) => {
        // Passing `from` and `to` forces GitHub to return a specific yearly range
        const from = `${year}-01-01`;
        const to   = year === currentYear
          ? new Date().toISOString().split("T")[0]   // today for current year
          : `${year}-12-31`;

        const res = await fetch(
          `https://github.com/users/${username}/contributions?from=${from}&to=${to}`,
          { headers: { Accept: "text/html" }, next: { revalidate: 60 } }
        );
        if (!res.ok) return; // skip years that fail gracefully

        const html = await res.text();
        // Each contribution cell: <td ... data-date="2024-03-10" data-level="2" ...>
        // Only levels > 0 count as activity
        const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([1-4])"/g;
        let match;
        while ((match = cellRegex.exec(html)) !== null) {
          datesWithActivity.add(match[1]);
        }
      })
    );

    if (datesWithActivity.size === 0) {
      return NextResponse.json({ error: "Failed to fetch contribution data" }, { status: 502 });
    }

    // Determine Today/Yesterday in the user's local context
    // localDateStr is our source of truth for "Today"
    const todayStr =
      localDateStr ||
      new Date(new Date().getTime() - offset * 60000).toISOString().split("T")[0];

    const getYesterday = (dateS: string) => {
      const d = new Date(dateS);
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset()); // Normalize to pure date
      d.setDate(d.getDate() - 1);
      return d.toISOString().split("T")[0];
    };

    const yesterdayStr = getYesterday(todayStr);

    const hasCommittedToday     = datesWithActivity.has(todayStr);
    const hasCommittedYesterday = datesWithActivity.has(yesterdayStr);

    // Calculate streak by counting backwards from the last active day.
    // We allow up to 800 iterations (~2+ years) to handle very long streaks.
    let currentStreak = 0;
    if (hasCommittedToday || hasCommittedYesterday) {
      let checkDate = new Date(hasCommittedToday ? todayStr : yesterdayStr);
      checkDate.setMinutes(checkDate.getMinutes() + checkDate.getTimezoneOffset());

      let iterations = 0;
      while (iterations < 800) {
        const checkStr = checkDate.toISOString().split("T")[0];
        if (datesWithActivity.has(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
          iterations++;
        } else {
          break;
        }
      }
    }

    // Total active contribution days across all fetched years
    const totalActiveDays = datesWithActivity.size;

    return NextResponse.json({
      hasCommittedToday,
      hasCommittedYesterday,
      currentStreak,
      totalActiveDays,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error during streak calculation" },
      { status: 500 }
    );
  }
}

