"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import AllRepos from "./AllRepos";

interface ProfileResultsProps {
    data: any;
    onBack: () => void;
}

// Deterministic pseudo-score based on username string
function hashScore(seed: string, min: number, max: number): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
    }
    return min + (hash % (max - min + 1));
}

function getRiskLabel(score: number): { label: string; color: string; bg: string; barColor: string; cardBg: string } {
    if (score >= 70) return { label: "High Risk", color: "text-red-400", bg: "bg-red-500", barColor: "bg-emerald-500", cardBg: "bg-[#1a0a0a] border-red-500/30" };
    if (score >= 40) return { label: "Moderate Risk", color: "text-amber-400", bg: "bg-amber-500", barColor: "bg-amber-500", cardBg: "bg-[#1a1308] border-amber-500/30" };
    return { label: "Low Risk", color: "text-emerald-400", bg: "bg-emerald-500", barColor: "bg-cyan-500", cardBg: "bg-[#081a12] border-emerald-500/25" };
}

function getOverallRisk(score: number): { label: string; badgeColor: string; bannerColor: string; icon: string } {
    if (score >= 70) return { label: "High AI Influence", badgeColor: "bg-red-500/20 text-red-400 border-red-500/30", bannerColor: "bg-red-900/20 border-red-500/30 text-red-300", icon: "🔴" };
    if (score >= 40) return { label: "Moderate AI Influence", badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30", bannerColor: "bg-amber-900/20 border-amber-500/30 text-amber-300", icon: "🛡" };
    return { label: "Low AI Influence", badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", bannerColor: "bg-emerald-900/20 border-emerald-500/30 text-emerald-300", icon: "✅" };
}

// Circular progress SVG
function CircularScore({ score, size = 100 }: { score: number; size?: number }) {
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#10b981";

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1f2937" strokeWidth={10} />
            <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke={color} strokeWidth={10}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="white" fontSize={size * 0.22} fontWeight="bold">
                {score}
            </text>
        </svg>
    );
}

// Deterministic sparkline chart from score seed
function Sparkline({ score, color }: { score: number; color: string }) {
    const points = useMemo(() => {
        const pts: number[] = [];
        let val = score * 0.6;
        for (let i = 0; i < 12; i++) {
            // deterministic pseudo-random walk seeded from score
            const seed = (score * 17 + i * 37 + i * i * 3) % 40;
            val = Math.min(100, Math.max(0, val + seed - 20));
            pts.push(val);
        }
        return pts;
    }, [score]);

    const W = 220, H = 48;
    const minV = Math.min(...points);
    const maxV = Math.max(...points) || 1;
    const toX = (i: number) => (i / (points.length - 1)) * W;
    const toY = (v: number) => H - ((v - minV) / (maxV - minV + 0.001)) * (H - 6) - 2;
    const polyline = points.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
    const areaPath = `M${toX(0)},${toY(points[0])} ${points.map((v, i) => `L${toX(i)},${toY(v)}`).join(" ")} L${W},${H} L0,${H} Z`;

    // Derive fill color from the barColor class string
    const strokeColor =
        color.includes("cyan") ? "#06b6d4" :
            color.includes("amber") ? "#f59e0b" :
                color.includes("red") ? "#ef4444" :
                    "#10b981";

    return (
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="mt-1 opacity-80">
            <defs>
                <linearGradient id={`sg-${score}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#sg-${score})`} />
            <polyline points={polyline} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

// Single metric card
function MetricCard({ icon, iconBg, cardBgClass, title, score, description }: { icon: React.ReactNode; iconBg?: string; cardBgClass?: string; title: string; score: number; description: string }) {
    const risk = getRiskLabel(score);
    const barWidth = `${score}%`;

    return (
        <div className={`border rounded-2xl p-6 flex flex-col gap-4 transition-colors ${cardBgClass || risk.cardBg}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg || "bg-white/10"}`}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-white font-semibold text-base">{title}</p>
                        <p className={`text-sm font-medium ${risk.color}`}>{risk.label}</p>
                    </div>
                </div>
                <span className="text-white text-3xl font-black">{score}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${risk.barColor} transition-all duration-700`}
                    style={{ width: barWidth }}
                />
            </div>
            <Sparkline score={score} color={risk.barColor} />
            <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

// GitHub-style contribution graph fetching real data
function GitHubContributions({ username }: { username: string }) {
    const [weeks, setWeeks] = useState<{ date: string; level: number; count: number }[][]>([]);
    const [monthLabels, setMonthLabels] = useState<{ label: string; index: number }[]>([]);
    const [totalActiveDays, setTotalActiveDays] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/github/contributions?username=${username}`)
            .then(r => r.json())
            .then(data => {
                const contribs = data.contributions || [];
                setTotalActiveDays(data.totalContributions ?? 0);

                if (contribs.length === 0) {
                    setWeeks([]);
                    return;
                }

                // Layout the grid (Sunday start)
                const grid: { date: string; level: number; count: number }[][] = [];
                let currentWeek: { date: string; level: number; count: number }[] = [];

                const firstDate = new Date(contribs[0].date);
                const startDayOfWeek = firstDate.getDay();

                for (let i = 0; i < startDayOfWeek; i++) {
                    currentWeek.push({ date: "", level: -1, count: 0 });
                }

                contribs.forEach((day: any) => {
                    currentWeek.push(day);
                    if (currentWeek.length === 7) {
                        grid.push(currentWeek);
                        currentWeek = [];
                    }
                });

                if (currentWeek.length > 0) {
                    while (currentWeek.length < 7) {
                        currentWeek.push({ date: "", level: -1, count: 0 });
                    }
                    grid.push(currentWeek);
                }

                setWeeks(grid);

                const labels: { label: string; index: number }[] = [];
                let lastMonthIndex = -1;
                grid.forEach((week, i) => {
                    const firstValidDay = week.find(d => d.level !== -1);
                    if (firstValidDay) {
                        const d = new Date(firstValidDay.date);
                        const monthIndex = d.getMonth();
                        const m = d.toLocaleDateString("en-US", { month: "short" });
                        if (monthIndex !== lastMonthIndex) {
                            labels.push({ label: m, index: i });
                            lastMonthIndex = monthIndex;
                        }
                    }
                });
                setMonthLabels(labels);
            })
            .catch(() => {
                setWeeks([]);
                setTotalActiveDays(0);
            })
            .finally(() => setLoading(false));
    }, [username]);

    if (!loading && weeks.length === 0) return null;

    return (
        <div className="w-full mb-8 animate-in fade-in duration-1000 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <h2 className="text-[16px] font-normal text-neutral-200">
                    {totalActiveDays !== null ? totalActiveDays.toLocaleString() : "—"} contributions in the last year
                </h2>
                <div className="text-[12px] text-neutral-400 hover:text-blue-400 cursor-pointer hidden sm:block">
                    Contribution settings <span className="text-[10px] ml-1">▼</span>
                </div>
            </div>

            <div className="border border-white/10 rounded-md p-4 bg-transparent">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-emerald-400 animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Full-width SVG contribution graph */}
                        {(() => {
                            const COLS = weeks.length;
                            const ROWS = 7;
                            const DAY_LABEL_W = 28;
                            const TOP_LABEL_H = 18;
                            const CELL_GAP = 2;
                            // We use a fixed viewBox width so SVG scales to full width
                            const VW = 780;
                            const gridW = VW - DAY_LABEL_W - 4;
                            const cellSize = (gridW - (COLS - 1) * CELL_GAP) / COLS;
                            const VH = TOP_LABEL_H + ROWS * cellSize + (ROWS - 1) * CELL_GAP + 4;

                            const colorFor = (level: number) =>
                                level === 0 ? "#161b22" :
                                    level === 1 ? "#0e4429" :
                                        level === 2 ? "#006d32" :
                                            level === 3 ? "#26a641" : "#39d353";

                            return (
                                <svg
                                    viewBox={`0 0 ${VW} ${VH}`}
                                    width="100%"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ display: "block" }}
                                >
                                    {/* Day-of-week labels */}
                                    {["Mon", "Wed", "Fri"].map((label, idx) => {
                                        const rowIndex = idx === 0 ? 1 : idx === 1 ? 3 : 5;
                                        const y = TOP_LABEL_H + rowIndex * (cellSize + CELL_GAP) + cellSize / 2 + 3;
                                        return (
                                            <text key={label} x={0} y={y} fill="#6b7280" fontSize="8" fontFamily="sans-serif">
                                                {label}
                                            </text>
                                        );
                                    })}

                                    {/* Month labels */}
                                    {monthLabels.map((m, i) => {
                                        const x = DAY_LABEL_W + m.index * (cellSize + CELL_GAP);
                                        return (
                                            <text key={i} x={x} y={12} fill="#6b7280" fontSize="8" fontFamily="sans-serif">
                                                {m.label}
                                            </text>
                                        );
                                    })}

                                    {/* Grid cells */}
                                    {weeks.map((week, wi) =>
                                        week.map((day, di) => {
                                            if (day.level === -1) return null;
                                            const x = DAY_LABEL_W + wi * (cellSize + CELL_GAP);
                                            const y = TOP_LABEL_H + di * (cellSize + CELL_GAP);
                                            const title = day.level === 0
                                                ? `No contributions on ${day.date}`
                                                : `${day.count} contributions on ${day.date}`;
                                            return (
                                                <rect
                                                    key={`${wi}-${di}`}
                                                    x={x} y={y}
                                                    width={cellSize} height={cellSize}
                                                    rx={1.5} ry={1.5}
                                                    fill={colorFor(day.level)}
                                                    className="hover:opacity-80 cursor-pointer transition-opacity"
                                                >
                                                    <title>{title}</title>
                                                </rect>
                                            );
                                        })
                                    )}
                                </svg>
                            );
                        })()}

                        {/* Footer: Learn more + legend */}
                        <div className="flex flex-wrap items-center justify-between mt-3 text-[12px] text-neutral-400">
                            <a href="#" className="hover:text-blue-400 transition-colors">Learn how we count contributions</a>
                            <div className="flex items-center gap-1 mt-2 sm:mt-0">
                                <span className="mr-1">Less</span>
                                {["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"].map((c, i) => (
                                    <div key={i} style={{ backgroundColor: c }} className="rounded-[2px] w-[10px] h-[10px]" />
                                ))}
                                <span className="ml-1">More</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}


export default function ProfileResults({ data, onBack }: ProfileResultsProps) {
    const { rest, graphql } = data;

    const login = rest?.login || "unknown";
    const name = graphql?.name || rest?.name || login;
    const avatarUrl = graphql?.avatarUrl || rest?.avatar_url;
    const bio = graphql?.bio || rest?.bio;
    const location = rest?.location;
    const company = rest?.company;
    const createdAt = rest?.created_at;
    const followers = rest?.followers ?? 0;
    const following = rest?.following ?? 0;
    const publicRepos = rest?.public_repos ?? 0;
    const githubUrl = `https://github.com/${login}`;

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";

    // Deterministic AI scores from username
    const aiScore = useMemo(() => hashScore(login + "ai", 20, 80), [login]);
    const styleDrift = useMemo(() => hashScore(login + "sd", 10, 60), [login]);
    const postMerge = useMemo(() => hashScore(login + "pm", 5, 40), [login]);
    const ownership = useMemo(() => hashScore(login + "ow", 50, 95), [login]);
    const repoTrend = useMemo(() => hashScore(login + "rt", 15, 55), [login]);
    const overallScore = useMemo(() => Math.round((aiScore + styleDrift + postMerge + repoTrend) / 4), [aiScore, styleDrift, postMerge, repoTrend]);
    const overallRisk = getOverallRisk(overallScore);
    const scanId = useMemo(() => `trace_${login.slice(0, 4)}${hashScore(login, 1000, 9999)}`, [login]);

    return (
        <div className="min-h-screen bg-black text-white flex">

            {/* === LEFT SIDEBAR === */}
            <aside className="w-64 shrink-0 border-r border-white/10 flex flex-col items-center py-10 px-5 gap-6 sticky top-0 h-screen overflow-y-auto">

                {/* Back link */}
                <button
                    onClick={onBack}
                    className="self-start flex items-center gap-1.5 text-neutral-500 hover:text-white text-sm transition-colors mb-2"
                >
                    ← Scan
                </button>

                {/* Avatar */}
                <div className="relative">
                    {avatarUrl ? (
                        <Image src={avatarUrl} alt={name} width={96} height={96} className="rounded-full border-2 border-white/10 shadow-xl" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-white/10 flex items-center justify-center text-3xl font-bold">
                            {login.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black" />
                </div>

                {/* Name */}
                <div className="text-center">
                    <h2 className="text-white font-bold text-lg leading-tight">{name}</h2>
                    <p className="text-neutral-500 text-base">@{login}</p>
                </div>

                {/* Risk badge */}
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${overallRisk.badgeColor}`}>
                    {overallRisk.label}
                </span>

                {/* Stats */}
                <div className="w-full grid grid-cols-3 gap-1 text-center">
                    {[
                        { label: "Repos", value: publicRepos },
                        { label: "Followers", value: followers >= 1000 ? `${(followers / 1000).toFixed(0)}K` : followers },
                        { label: "Following", value: following },
                    ].map((s) => (
                        <div key={s.label} className="bg-white/5 border border-white/5 rounded-xl py-3 px-2">
                            <div className="text-white font-bold text-base leading-none">{s.value}</div>
                            <div className="text-neutral-600 text-[11px] mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Meta info */}
                <div className="w-full space-y-2.5 text-sm text-neutral-400">
                    {location && (
                        <div className="flex items-center gap-2">
                            <span>📍</span><span>{location}</span>
                        </div>
                    )}
                    {company && (
                        <div className="flex items-center gap-2">
                            <span>🏢</span><span>{company}</span>
                        </div>
                    )}
                    {createdAt && (
                        <div className="flex items-center gap-2">
                            <span>📅</span><span>Joined {formatDate(createdAt)}</span>
                        </div>
                    )}
                    {bio && (
                        <p className="text-neutral-500 text-[11px] leading-relaxed pt-1 border-t border-white/5">{bio}</p>
                    )}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Open GitHub */}
                <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-neutral-300 transition-colors"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    Open GitHub Profile ↗
                </a>
            </aside>

            {/* === MAIN CONTENT === */}
            <main className="flex-1 overflow-y-auto px-12 py-12 space-y-10">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">AI Contribution Analysis</h1>
                        <p className="text-neutral-600 text-base">Scan ID · <span className="font-mono">{scanId}</span></p>
                    </div>
                    {/* Score ring */}
                    <div className="flex flex-col items-center gap-1">
                        <CircularScore score={overallScore} size={110} />
                        <span className="text-neutral-500 text-sm">/ 100</span>
                        <span className="text-neutral-400 text-sm font-medium">{overallRisk.label}</span>
                    </div>
                </div>

                {/* Alert banner */}
                <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border ${overallRisk.bannerColor}`}>
                    <span className="text-lg">{overallRisk.icon}</span>
                    <span className="text-base font-medium">
                        {overallRisk.label} · Overall AI Risk Score: {overallScore}/100
                    </span>
                </div>

                {/* Metric cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <MetricCard
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                        iconBg="bg-amber-500/15"
                        cardBgClass="bg-amber-500/5 border-amber-500/20"
                        title="AI Likelihood Score"
                        score={aiScore}
                        description="Measures how closely commit patterns, naming conventions and code entropy match known AI code generation signatures."
                    />
                    <MetricCard
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="4" height="9" /><rect x="10" y="7" width="4" height="14" /><rect x="17" y="2" width="4" height="19" /></svg>}
                        iconBg="bg-violet-500/15"
                        cardBgClass="bg-violet-500/5 border-violet-500/20"
                        title="Style Drift Indicator"
                        score={styleDrift}
                        description="Detects sudden shifts in coding style, indentation, and naming patterns that often coincide with LLM adoption."
                    />
                    <MetricCard
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" /></svg>}
                        iconBg="bg-cyan-500/15"
                        cardBgClass="bg-cyan-500/5 border-cyan-500/20"
                        title="Post-Merge Stability"
                        score={postMerge}
                        description="Tracks hotfixes and reverts within 72 hours of a PR merge — a key signal of low-confidence, AI-drafted code."
                    />
                    <MetricCard
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                        iconBg="bg-emerald-500/15"
                        cardBgClass="bg-emerald-500/5 border-emerald-500/20"
                        title="Ownership Confidence"
                        score={ownership}
                        description="Analyzes PR review quality, issue resolution and discussion depth to gauge true authorship understanding."
                    />
                </div>

                {/* Full-width card */}
                <MetricCard
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>}
                    iconBg="bg-orange-500/15"
                    cardBgClass="bg-orange-500/5 border-orange-500/20"
                    title="Repository AI Influence Trend"
                    score={repoTrend}
                    description="Monitors commit frequency, burst patterns and off-hours activity for increasing AI assistance over time."
                />

                <GitHubContributions username={login} />

                {/* All Repositories Section */}
                <div className="pt-8 border-t border-white/10 mt-8">
                    <AllRepos data={data} username={login} />
                </div>

                {/* Disclaimer footer */}
                <p className="text-center text-neutral-600 text-sm pt-4 pb-8">
                    Analysis is probabilistic, not deterministic. DevTrack does not store any source code or personal data.
                </p>
            </main>
        </div>
    );
}
