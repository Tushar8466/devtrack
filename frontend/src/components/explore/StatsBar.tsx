"use client";

interface StatsBarProps {
    data: any;
}

export default function StatsBar({ data }: StatsBarProps) {
    const { rest, graphql } = data;

    const publicRepos = rest?.public_repos || 0;
    const contributions = graphql?.contributionsCollection?.contributionCalendar?.totalContributions;

    // Calculate total stars
    let totalStars = 0;
    let topLanguage = "N/A";

    if (graphql?.repositories?.nodes) {
        totalStars = graphql.repositories.nodes.reduce(
            (acc: number, repo: any) => acc + (repo.stargazerCount || 0), 0
        );

        // Calculate top language
        const langCounts: Record<string, number> = {};
        graphql.repositories.nodes.forEach((repo: any) => {
            const lang = repo.primaryLanguage?.name;
            if (lang) {
                langCounts[lang] = (langCounts[lang] || 0) + 1;
            }
        });

        let maxVal = 0;
        for (const [lang, count] of Object.entries(langCounts)) {
            if (count > maxVal) {
                maxVal = count;
                topLanguage = lang;
            }
        }
    }

    const stats = [
        { label: "Public Repos", value: publicRepos, icon: "📦", color: "text-white" },
        { label: "Total Stars", value: totalStars, icon: "⭐", color: "text-white" },
    ];

    if (contributions !== undefined) {
        stats.push({ label: "Contributions (Year)", value: contributions, icon: "🔥", color: "text-white" });
    }

    stats.push({ label: "Top Language", value: topLanguage, icon: "💻", color: "text-white" });

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-colors shadow-lg flex flex-col items-center justify-center text-center group">
                    <div className="text-3xl mb-3 drop-shadow-md group-hover:scale-110 transition-transform">{s.icon}</div>
                    <div className={`text-3xl font-black mb-1 ${s.color} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                        {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                    </div>
                    <div className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">{s.label}</div>
                </div>
            ))}
        </div>
    );
}
