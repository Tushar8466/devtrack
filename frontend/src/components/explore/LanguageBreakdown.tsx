"use client";

interface LanguageBreakdownProps {
    data: any;
}

export default function LanguageBreakdown({ data }: LanguageBreakdownProps) {
    const { graphql } = data;
    const repos = graphql?.repositories?.nodes || [];

    if (repos.length === 0) return null;

    const langStats: Record<string, { count: number; color: string }> = {};
    let totalLangs = 0;

    repos.forEach((repo: any) => {
        const langName = repo.primaryLanguage?.name;
        const langColor = repo.primaryLanguage?.color || "#cccccc";

        if (langName) {
            if (!langStats[langName]) {
                langStats[langName] = { count: 0, color: langColor };
            }
            langStats[langName].count++;
            totalLangs++;
        }
    });

    if (totalLangs === 0) return null;

    // Convert to array, sort by count descending, and calculate percentages
    const sortedLangs = Object.entries(langStats)
        .map(([name, info]) => ({
            name,
            color: info.color,
            count: info.count,
            percent: (info.count / totalLangs) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8); // Top 8 languages

    return (
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <span>📊</span> Top Languages
            </h3>

            <div className="w-full h-4 flex rounded-full overflow-hidden mb-6 bg-white/5 shadow-inner">
                {sortedLangs.map((lang) => (
                    <div
                        key={lang.name}
                        style={{
                            width: `${lang.percent}%`,
                            backgroundColor: lang.color
                        }}
                        className="h-full hover:brightness-110 transition-all"
                        title={`${lang.name}: ${lang.percent.toFixed(1)}%`}
                    />
                ))}
            </div>

            <div className="flex flex-wrap gap-4">
                {sortedLangs.map((lang) => (
                    <div key={lang.name} className="flex items-center gap-2 text-sm bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                        <span
                            className="w-3 h-3 rounded-full shadow-sm"
                            style={{ backgroundColor: lang.color }}
                        />
                        <span className="text-white font-medium">{lang.name}</span>
                        <span className="text-neutral-500">{lang.percent.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
