const username = "Tushar8466";
const offset = -330; 
const localDateStr = "2026-03-14";

console.log("Starting streak debug for", username);

async function test() {
  const fetchPage = async (page) => {
    const url = `https://api.github.com/users/${username}/events?per_page=100&page=${page}`;
    console.log("Fetching", url);
    const res = await fetch(url, {
      headers: { "User-Agent": "node-fetch" }
    });
    if (!res.ok) {
      console.log("Failed page", page, res.status);
      return [];
    }
    const data = await res.json();
    return data;
  };

  try {
    const pages = await Promise.all([fetchPage(1), fetchPage(2), fetchPage(3)]);
    const events = pages.flat();
    console.log("Total events:", events.length);
    
    if (events.length === 0) {
      console.log("No events found. Check username or rate limit.");
    }

    const pushEvents = events.filter(e => e.type === "PushEvent");
    console.log("Total PushEvents:", pushEvents.length);

    const dates = new Set();
    pushEvents.forEach(e => {
        const d = new Date(e.created_at);
        const local = new Date(d.getTime() - (offset * 60000));
        dates.add(local.toISOString().split('T')[0]);
    });

    console.log("Unique Push Dates (Local):", Array.from(dates).sort());
    
    const targetToday = localDateStr;
    const targetYesterday = new Date(new Date(localDateStr).getTime() - 86400000).toISOString().split('T')[0];

    console.log("Target Today:", targetToday, "Target Yesterday:", targetYesterday);
    console.log("Has Today:", dates.has(targetToday));
    console.log("Has Yesterday:", dates.has(targetYesterday));

  } catch (err) {
    console.error("Error in test:", err);
  }
}

test().then(() => console.log("Done"));
