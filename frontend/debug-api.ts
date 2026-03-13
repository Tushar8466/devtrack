import { NextResponse } from "next/server";
const username = "Tushar8466";
const offset = -330; // IST
const localDate = "2026-03-14";

async function test() {
  const fetchPage = async (page: number) => {
    const res = await fetch(
      `https://api.github.com/users/${username}/events?per_page=100&page=${page}`,
      {
        headers: {
          "User-Agent": "devtrack-streak-check",
          Accept: "application/vnd.github+json",
          // Add token from env if possible, but let's just see if we can get it or if it hits rate limit
        }
      }
    );
    if (!res.ok) {
        const text = await res.text();
        console.log("Page", page, "failed:", res.status, text);
        return [];
    }
    return await res.json();
  };

  const allEvents = await Promise.all([fetchPage(1), fetchPage(2), fetchPage(3)]);
  const events = allEvents.flat();
  console.log("Total events fetched:", events.length);

  const datesWithCommits = new Set<string>();
  
  events.forEach((event: any) => {
    if (event.type === "PushEvent") {
      const utcDate = new Date(event.created_at);
      const localTime = new Date(utcDate.getTime() - (offset * 60000));
      const date = localTime.toISOString().split("T")[0];
      datesWithCommits.add(date);
    }
  });

  console.log("Dates with commits:", Array.from(datesWithCommits).sort());

  const getFormatted = (d: Date) => d.toISOString().split("T")[0];
  const referenceDate = new Date(localDate);
  
  const today = new Date(referenceDate);
  const todayStr = getFormatted(today);
  
  const yesterday = new Date(referenceDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getFormatted(yesterday);

  console.log("Target Today:", todayStr);
  console.log("Target Yesterday:", yesterdayStr);
  console.log("Has Today:", datesWithCommits.has(todayStr));
  console.log("Has Yesterday:", datesWithCommits.has(yesterdayStr));
}

test();
