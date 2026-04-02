import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {
    // Fetch basic user data
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { "Accept": "application/vnd.github.v3+json" }
    });

    if (!userRes.ok) throw new Error("User not found");
    const user = await userRes.json();

    // Fetch repos for language analysis
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    const repos = reposRes.ok ? await reposRes.json() : [];

    // Simple analysis logic
    const languages: Record<string, number> = {};
    let totalSize = 0;
    repos.forEach((r: any) => {
      if (r.language) {
        languages[r.language] = (languages[r.language] || 0) + 1;
        totalSize += r.size;
      }
    });

    const topLang = Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

    // Genetic traits (mocked logic based on real stats)
    const dna = {
      traits: [
        { name: "Logic Complexity", value: 70 + (Math.random() * 25), description: "Propensity for complex control flows." },
        { name: "Abstraction Depth", value: 60 + (Math.random() * 35), description: "Tendency to create reusable patterns." },
        { name: "Async Velocity", value: 50 + (Math.random() * 45), description: "Efficiency in handling non-blocking operations." },
        { name: "Syntax Stability", value: 80 + (Math.random() * 15), description: "Consistency in coding style and formatting." },
        { name: "Social Synergy", value: Math.min(user.followers / 10, 100), description: "Impact and reach within the ecosystem." },
      ],
      signature: {
        hash: Buffer.from(username).toString('hex').slice(0, 12).toUpperCase(),
        type: topLang === "TypeScript" ? "STABLE_TYPED" : topLang === "C++" ? "LOW_LEVEL_NATIVE" : "DYNAMIC_SCRIPT",
        compatibility: 85 + (Math.random() * 10)
      }
    };

    return NextResponse.json({ user, dna });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
