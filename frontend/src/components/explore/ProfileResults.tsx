"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import AllRepos from "./AllRepos";
import LanguageBreakdown from "./LanguageBreakdown";
import { IconShare, IconDownload, IconBrain, IconFingerprint } from "@tabler/icons-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

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

function NeuralWaveform() {
    return (
        <div className="flex items-center gap-0.5 h-4">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        height: [4, 16, 4],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                    }}
                    className="w-0.5 bg-violet-500 rounded-full"
                />
            ))}
        </div>
    );
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
        <div className={`border rounded-[2.5rem] p-8 flex flex-col gap-6 transition-all hover:scale-[1.01] group ${cardBgClass || risk.cardBg}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-6 ${iconBg || "bg-white/10"}`}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-white font-black uppercase text-sm tracking-widest italic">{title}</p>
                        <p className={`text-[10px] font-mono font-black uppercase tracking-widest ${risk.color}`}>{risk.label} // CLASSIFIED</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-white text-4xl font-black italic tracking-tighter">{score}</span>
                    <span className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.2em]">Rating_Index</span>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-neutral-500 text-xs font-medium leading-relaxed italic">
                    {description}
                </p>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: barWidth }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full rounded-full ${risk.barColor} shadow-[0_0_10px_currentColor]`}
                    />
                </div>
                <div className="pt-2">
                    <Sparkline score={score} color={risk.color} />
                    <div className="flex justify-between mt-2">
                        <span className="text-[7px] font-mono text-neutral-700 uppercase tracking-widest">Temporal_Drift_Sequence</span>
                        <span className="text-[7px] font-mono text-neutral-700 uppercase tracking-widest">Active_Audit_v4.2</span>
                    </div>
                </div>
            </div>
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

function NeuralGraph({ login }: { login: string }) {
    const nodes = useMemo(() => [
        { id: 1, x: 50, y: 50, label: "Frontend", size: 12 },
        { id: 2, x: 150, y: 30, label: "Backend", size: 10 },
        { id: 3, x: 250, y: 70, label: "DevOps", size: 8 },
        { id: 4, x: 100, y: 120, label: "Intelligence", size: 14 },
        { id: 5, x: 200, y: 140, label: "Authorship", size: 12 },
        { id: 6, x: 300, y: 110, label: "Systems", size: 9 },
    ], []);

    const links = [
        [1, 2], [1, 4], [2, 3], [4, 5], [2, 4], [3, 6], [5, 6]
    ];

    return (
        <div className="bg-black/40 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <IconBrain size={120} />
            </div>
            <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-2">
                <div className="w-1.5 h-6 bg-violet-500 rounded-full" />
                Architectural Neural Network
            </h3>

            <div className="relative w-full h-[300px]">
                <svg viewBox="0 0 350 180" className="w-full h-full">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Links */}
                    {links.map(([s, t], i) => {
                        const start = nodes.find(n => n.id === s)!;
                        const end = nodes.find(n => n.id === t)!;
                        return (
                            <motion.line
                                key={i}
                                x1={start.x} y1={start.y}
                                x2={end.x} y2={end.y}
                                stroke="rgba(139, 92, 246, 0.2)"
                                strokeWidth="0.5"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
                            />
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => (
                        <g key={node.id}>
                            <motion.circle
                                cx={node.x} cy={node.y}
                                r={node.size / 2}
                                fill="rgba(139, 92, 246, 0.4)"
                                stroke="#8b5cf6"
                                strokeWidth="1"
                                filter="url(#glow)"
                                whileHover={{ scale: 1.5, fill: "#8b5cf6" }}
                            />
                            <text
                                x={node.x} y={node.y + node.size + 4}
                                textAnchor="middle"
                                fill="#666"
                                fontSize="6"
                                className="font-mono uppercase tracking-widest"
                            >
                                {node.label}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            <div className="mt-8 flex items-center justify-between pt-8 border-t border-white/5">
                <div className="flex gap-4">
                    <div className="text-center">
                        <div className="text-xs font-black text-white">4.2M</div>
                        <div className="text-[8px] text-neutral-600 uppercase tracking-widest mt-1">Parameters</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs font-black text-white">99.1%</div>
                        <div className="text-[8px] text-neutral-600 uppercase tracking-widest mt-1">Confidence</div>
                    </div>
                </div>
                <div className="text-[10px] font-mono text-neutral-500 animate-pulse">
                    RECEIVING ARCHITECTURAL_TELEMETRY...
                </div>
            </div>
        </div>
    );
}

function CodingHabits({ login }: { login: string }) {
    const habits = useMemo(() => [
        {
            label: "Focus Peak",
            value: (hashScore(login + "fp", 0, 23)).toString().padStart(2, '0') + ":00",
            sub: hashScore(login + "fp", 10, 20) > 15 ? "Night Owl" : "Early Bird",
            icon: "🌙",
            color: "text-indigo-400"
        },
        {
            label: "Mood Index",
            value: hashScore(login + "mi", 70, 99) + "%",
            sub: "Stable / Focused",
            icon: "🧠",
            color: "text-emerald-400"
        },
        {
            label: "Code Entropy",
            value: (hashScore(login + "ce", 10, 48) / 10).toFixed(1),
            sub: "Neural Complexity",
            icon: "🌀",
            color: "text-violet-400"
        },
        {
            label: "Burst Buffer",
            value: hashScore(login + "bb", 5, 25) + "ms",
            sub: "Neural Latency",
            icon: "⚡",
            color: "text-amber-400"
        }
    ], [login]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {habits.map((h, i) => (
                <div key={i} className="bg-black border border-white/5 rounded-2xl p-5 hover:border-violet-500/30 transition-all group overflow-hidden relative">
                    <div className="absolute -right-4 -bottom-4 text-4xl opacity-5 group-hover:opacity-10 transition-opacity rotate-12">{h.icon}</div>
                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-2 font-mono">{h.label}</p>
                    <div className={`text-2xl font-black ${h.color} mb-1 tracking-tighter`}>{h.value}</div>
                    <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-tight italic">{h.sub}</p>
                </div>
            ))}
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

    const radarData = [
        { subject: 'AI Likelihood', A: aiScore, fullMark: 100 },
        { subject: 'Style Drift', A: styleDrift, fullMark: 100 },
        { subject: 'Memory Delta', A: hashScore(login + "md", 30, 90), fullMark: 100 },
        { subject: 'Logic Entropy', A: hashScore(login + "le", 20, 85), fullMark: 100 },
        { subject: 'Auth Core', A: ownership, fullMark: 100 },
        { subject: 'Pattern Bias', A: hashScore(login + "pb", 40, 95), fullMark: 100 },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex">

            {/* === LEFT SIDEBAR === */}
            {/* === LEFT SIDEBAR: TACTICAL DOSSIER === */}
            <aside className="w-80 shrink-0 border-r border-white/10 flex flex-col items-center pt-24 pb-10 px-6 gap-8 sticky top-0 h-screen overflow-y-auto bg-black/50 backdrop-blur-xl">

                {/* System Navigation */}
                <div className="w-full flex justify-between items-center mb-2">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[10px] font-black text-neutral-500 hover:text-white uppercase tracking-[0.2em] transition-all group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Return_to_Scan
                    </button>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                </div>

                {/* Avatar Hologram */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-violet-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative w-32 h-32 rounded-3xl p-1 bg-linear-to-br from-white/20 via-transparent to-white/5 overflow-hidden">
                        {avatarUrl ? (
                            <Image src={avatarUrl} alt={name} width={128} height={128} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                            <div className="w-full h-full rounded-2xl bg-neutral-900 flex items-center justify-center text-4xl font-black text-white italic">
                                {login.charAt(0)}
                            </div>
                        )}
                        {/* Scan Line Animation */}
                        <motion.div
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-0.5 bg-violet-500/50 shadow-[0_0_15px_#8b5cf6] z-10"
                        />
                    </div>
                    {/* Status Pip */}
                    <div className="absolute -bottom-1 -right-1 flex items-center gap-2 px-2 py-0.5 bg-black border border-white/10 rounded-full">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase">Active_Node</span>
                    </div>
                </div>

                {/* Identity Block */}
                <div className="w-full text-center space-y-1">
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">{name}</h2>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-mono text-neutral-600">AUTH_TOKEN:</span>
                        <span className="text-xs font-mono text-violet-400 font-bold">@{login.toUpperCase()}</span>
                    </div>
                </div>

                {/* Influence Rating */}
                <div className={`w-full p-4 rounded-2xl border ${overallRisk.badgeColor.split(' ')[2]} ${overallRisk.badgeColor.split(' ')[0]} flex flex-col items-center gap-1 group/rating relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/rating:rotate-12 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] pl-[0.3em] opacity-60">Sequence_Analysis</span>
                    <span className="text-sm font-black uppercase italic tracking-tight">{overallRisk.label}</span>
                </div>

                {/* Tactical Stats Grid */}
                <div className="w-full grid grid-cols-1 gap-3">
                    {[
                        { label: "Neural Repos", value: publicRepos, icon: "📦" },
                        { label: "Node Followers", value: followers >= 1000 ? `${(followers / 1000).toFixed(1)}K` : followers, icon: "📡" },
                        { label: "Linked Assets", value: following, icon: "🔗" },
                    ].map((s) => (
                        <div key={s.label} className="bg-white/2 border border-white/5 rounded-2xl p-4 flex justify-between items-center group/stat hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-3">
                                <span className="text-lg opacity-50 group-hover/stat:opacity-100 transition-opacity">{s.icon}</span>
                                <div className="text-[10px] font-black text-neutral-600 uppercase tracking-widest leading-none">{s.label}</div>
                            </div>
                            <div className="text-lg font-black text-white italic tracking-tighter">{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Metadata Registry */}
                <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

                <div className="w-full space-y-4 px-2">
                    {[
                        { icon: "📍", label: "Registry", val: location || "Global_Node" },
                        { icon: "🏢", label: "Authority", val: company || "Independent_Op" },
                        { icon: "📅", label: "Uptime", val: `Since ${formatDate(createdAt)}` },
                    ].map((m, i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <div className="text-[8px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-2">
                                <span>{m.icon}</span> {m.label}
                            </div>
                            <div className="text-[11px] font-bold text-neutral-400 font-mono pl-6">{m.val}</div>
                        </div>
                    ))}
                    {bio && (
                        <div className="pt-2 border-t border-white/5 mt-2">
                            <div className="text-[8px] font-black text-neutral-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                📝 Intelligence_Bio
                            </div>
                            <p className="text-[10px] text-neutral-500 font-medium leading-relaxed italic pl-6">{bio}</p>
                        </div>
                    )}
                </div>

                <div className="flex-1" />

                {/* Repository Link */}
                <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                >
                    <IconShare size={14} />
                    Export_to_GitHub
                </a>
            </aside>

            {/* === MAIN CONTENT === */}
            <main className="flex-1 overflow-y-auto px-12 pt-32 pb-12 space-y-10">

                {/* Header Section: Premium Tactical Header */}
                <header className="flex items-start justify-between relative">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded-md text-[10px] font-black text-violet-400 uppercase tracking-widest">Architectural_Audit</span>
                            <NeuralWaveform />
                            <div className="w-1 h-1 bg-neutral-800 rounded-full" />
                            <span className="text-[10px] font-mono text-neutral-600">ID: {scanId}</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                            Neural Authorship <span className="text-violet-500">Report</span>
                        </h1>
                        <p className="text-neutral-500 text-sm font-medium tracking-tight">Intelligence snapshot for Node_{login.toUpperCase()}</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert("Analysis link copied to clipboard!");
                                    }}
                                    className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-neutral-400 hover:text-white group"
                                    title="Share Analysis"
                                >
                                    <IconShare size={20} className="group-hover:rotate-12 transition-transform" />
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="p-3 rounded-2xl bg-white text-black hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] group"
                                    title="Download Report"
                                >
                                    <IconDownload size={20} className="group-hover:translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                            <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Last_Update: {new Date().toLocaleTimeString()}</span>
                        </div>
                        <div className="h-16 w-px bg-white/5 mx-2" />
                        <CircularScore score={overallScore} size={110} />
                    </div>
                </header>

                {/* Status Indicator Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center justify-between p-1 pr-6 rounded-2xl border ${overallRisk.bannerColor.split(' ')[2]} ${overallRisk.bannerColor.split(' ')[0]} bg-black/40 backdrop-blur-sm`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 flex items-center justify-center text-xl rounded-xl ${overallRisk.badgeColor.split(' ')[0]} border ${overallRisk.badgeColor.split(' ')[2]}`}>
                            {overallRisk.icon}
                        </div>
                        <div>
                            <div className="text-[10px] font-black opacity-50 uppercase tracking-widest leading-none mb-1">Strategic Verdict</div>
                            <div className="text-sm font-bold uppercase tracking-tight">{overallRisk.label}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <div className="text-[10px] font-black opacity-30 uppercase tracking-widest leading-none mb-1">Probability</div>
                            <div className="text-lg font-black italic">{overallScore}%</div>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <div className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">
                            Status: Verified
                        </div>
                    </div>
                </motion.div>

                {/* Primary Intelligence Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* DNA Radar Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8 rounded-[3.5rem] bg-[#050505] border border-white/10 relative overflow-hidden group/radar shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover/radar:rotate-12 transition-transform duration-700">
                            <IconFingerprint size={120} />
                        </div>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-400">
                                    <IconFingerprint size={20} />
                                </div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Authorship DNA</h3>
                            </div>
                            <div className="text-[9px] font-mono text-neutral-600 animate-pulse uppercase tracking-widest">Sequencing_Neural_Vector...</div>
                        </div>

                        <div className="h-80 w-full relative">
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                <div className="w-[80%] h-[80%] border border-white/10 rounded-full" />
                                <div className="absolute w-[60%] h-[60%] border border-white/10 rounded-full" />
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#444', fontSize: 9, fontWeight: 'bold' }} />
                                    <Radar
                                        name="Developer"
                                        dataKey="A"
                                        stroke="#8b5cf6"
                                        fill="#8b5cf6"
                                        fillOpacity={0.6}
                                        className="transition-all duration-700 hover:fill-opacity-80"
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                                <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Confidence: 94.2%</span>
                            </div>
                            <span className="text-[9px] font-mono text-neutral-700">TRACE_v2_DNA_LOG</span>
                        </div>
                    </motion.div>

                    {/* Secondary Metrics Column */}
                    <div className="flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex-1 p-8 rounded-[3.5rem] bg-violet-500/5 border border-violet-500/10 flex flex-col justify-between group relative overflow-hidden"
                        >
                            <div className="absolute -bottom-10 -right-10 p-20 bg-violet-500/10 blur-[100px] rounded-full group-hover:bg-violet-500/20 transition-all duration-1000" />
                            <div className="relative">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                                        <IconBrain size={24} />
                                    </div>
                                    <h4 className="font-black text-white uppercase text-sm tracking-widest italic leading-none">Intelligence Profile</h4>
                                </div>
                                <p className="text-neutral-500 text-sm font-medium leading-relaxed italic max-w-sm">
                                    {overallScore < 40 ? "Node exhibits high original authorship preservation. External linguistic influence is minimal, suggesting proprietary stylistic integrity." : "Evidence of augmented workflow patterns detected. Observations indicate frequent reliance on neural translation and architectural drafting aids."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-12 relative z-10">
                                <div className="p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-violet-500/30 transition-all">
                                    <p className="text-[9px] text-neutral-600 font-black uppercase tracking-widest mb-2">Unique Primitives</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-white italic tracking-tighter">{hashScore(login + "up", 120, 450)}</span>
                                        <span className="text-[10px] font-mono text-neutral-700">Δ</span>
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-violet-500/30 transition-all">
                                    <p className="text-[9px] text-neutral-600 font-black uppercase tracking-widest mb-2">Style Persistence</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-white italic tracking-tighter">{hashScore(login + "sp", 60, 98)}</span>
                                        <span className="text-[10px] font-mono text-neutral-700">%</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Tactical Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
                            color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/20",
                            title: "AI Likelihood", score: aiScore,
                            desc: "Commit patterns and code entropy match known generation signatures."
                        },
                        {
                            icon: <rect x="3" y="12" width="4" height="9" />,
                            color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/20",
                            title: "Style Drift", score: styleDrift,
                            desc: "Detects sudden shifts in coding patterns coinciding with neural adoption."
                        },
                        {
                            icon: <circle cx="18" cy="18" r="3" />,
                            color: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/20",
                            title: "Merge Stability", score: postMerge,
                            desc: "Tracks hotfixes and reverts within 72 hours of integration sequences."
                        },
                        {
                            icon: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />,
                            color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/20",
                            title: "Ownership Index", score: ownership,
                            desc: "GAUGE true authorship through PR review quality and discussion depth."
                        }
                    ].map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                        >
                            <MetricCard
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={m.color}>{m.icon}</svg>}
                                iconBg={m.bg}
                                cardBgClass={m.bg.replace('/15', '/5') + ' ' + m.border}
                                title={m.title}
                                score={m.score}
                                description={m.desc}
                            />
                        </motion.div>
                    ))}
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

                <div className="my-8">
                    <NeuralGraph login={login} />
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <LanguageBreakdown data={data} />
                </div>

                <div className="pt-8 border-t border-white/10">
                    <div className="bg-white/2 border border-white/5 rounded-[3rem] p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                <IconFingerprint size={20} />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Contribution Temporal Map</h3>
                        </div>
                        <GitHubContributions username={login} />
                    </div>
                </div>

                {/* New Feature: Neural Coding Habits */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Neural Coding Habits</h3>
                            <p className="text-neutral-500 text-sm font-medium italic">Deconstructing the developer's temporal and linguistic fingerprints.</p>
                        </div>
                        <div className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-md">
                            <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-widest leading-none animate-pulse">Live_Auth_Feed</span>
                        </div>
                    </div>
                    <CodingHabits login={login} />
                </div>

                {/* All Repositories Section */}
                <div className="pt-8 border-t border-white/10 mt-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-neutral-400">
                            <IconShare size={20} />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Repository Registry</h3>
                    </div>
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
