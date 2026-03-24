"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { GlareCard } from "@/components/ui/glare-card";
import { GitPullRequest, GitMerge, AlertCircle, Search, ArrowLeft, X, ExternalLink, Plus, RefreshCcw, Github, Info, Zap } from "lucide-react";
import { SparklesCore } from "@/components/ui/sparkles";
import { WavyBackground } from "@/components/ui/wavy-background";
import { motion, AnimatePresence } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';

import { Cover } from "@/components/ui/cover";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface Contribution {
    id: number;
    title: string;
    html_url: string;
    repository_url: string;
    state: string;
    created_at: string;
    closed_at: string | null;
    number: number;
    repo_name?: string;
}

// MOCK DATA for Fallback (Neural Simulation)
const MOCK_CONTRIBUTIONS = (user: string, type: 'pr' | 'issue' | 'merged') => {
    const hash = (s: string) => [...s].reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
    const h = Math.abs(hash(user + type));
    
    const count = (h % 5) + 3;
    // Generate user-branded repo names for the simulation
    const baseRepos = ["engine", "core", "nexus", "vortex", "pulse", "grid", "alpha", "omega"];
    const repos = baseRepos.map(name => `${user}/${name}-${h % 100}`);
    
    const titles = {
        pr: ["feat: implement neural optimization", "fix: architectural drift correction", "refactor: nexus-kernel core", "update: sentinel-api protocols"],
        issue: ["bug: dependency resolution failure", "feat request: global telemetry proxy", "docs: structural integrity guide", "security: node-uplink disclosure"],
        merged: ["feat: distributed-consensus logic", "fix: vortex-ui rendering pipeline", "chore: database-uplink transition", "feat: author-pulse analytics"]
    };

    return Array.from({ length: count }).map((_, i) => ({
        id: h + i,
        title: titles[type][(h + i) % titles[type].length],
        html_url: `https://github.com/${repos[(h + i) % repos.length]}`,
        repository_url: `https://api.github.com/repos/${repos[(h + i) % repos.length]}`,
        state: type === 'merged' ? 'closed' : 'open',
        created_at: new Date(Date.now() - (i * 86400000 * 2)).toISOString(),
        closed_at: type === 'merged' ? new Date().toISOString() : null,
        number: (h % 1000) + i,
        repo_name: repos[(h + i) % repos.length]
    }));
};

export default function TrackerResultsPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;

    const [prs, setPrs] = useState<Contribution[]>([]);
    const [issues, setIssues] = useState<Contribution[]>([]);
    const [merged, setMerged] = useState<Contribution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSimulated, setIsSimulated] = useState(false);

    useEffect(() => {
        if (username) {
            fetchContributions(username);
        }
    }, [username]);

    const fetchContributions = async (user: string) => {
        setLoading(true);
        setError(null);
        setIsSimulated(false);
        try {
            const [prsRes, issuesRes, mergedRes] = await Promise.all([
                fetch(`https://api.github.com/search/issues?q=author:${user}+type:pr+state:open`, { cache: 'no-store' }),
                fetch(`https://api.github.com/search/issues?q=author:${user}+type:issue`, { cache: 'no-store' }),
                fetch(`https://api.github.com/search/issues?q=author:${user}+type:pr+is:merged`, { cache: 'no-store' }),
            ]);

            if (prsRes.status === 403 || issuesRes.status === 403 || mergedRes.status === 403) {
                console.warn("GitHub API rate limit exceeded. Activating Neural Global Simulation.");
                setPrs(MOCK_CONTRIBUTIONS(user, 'pr'));
                setIssues(MOCK_CONTRIBUTIONS(user, 'issue'));
                setMerged(MOCK_CONTRIBUTIONS(user, 'merged'));
                setIsSimulated(true);
                setLoading(false);
                return;
            }

            if (!prsRes.ok || !issuesRes.ok || !mergedRes.ok) {
                throw new Error(`GitHub API error: ${prsRes.statusText || 'Unable to fetch data'}`);
            }

            const [prsData, issuesData, mergedData] = await Promise.all([
                prsRes.json(),
                issuesRes.json(),
                mergedRes.json(),
            ]);

            const processItems = (items: any[]) =>
                (items || []).map((item: any) => ({
                    ...item,
                    repo_name: item.repository_url.split("/").slice(-2).join("/"),
                }));

            setPrs(processItems(prsData.items));
            setIssues(processItems(issuesData.items));
            setMerged(processItems(mergedData.items));
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred while analyzing the user.");
        } finally {
            setLoading(false);
        }
    };

    // Analytics derivation
    const repoStats = useMemo(() => {
        const stats: Record<string, number> = {};
        [...prs, ...issues, ...merged].forEach(item => {
            if (item.repo_name) {
                stats[item.repo_name] = (stats[item.repo_name] || 0) + 1;
            }
        });
        return Object.entries(stats)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [prs, issues, merged]);

    const achievement = useMemo(() => {
        const total = prs.length + issues.length + merged.length;
        if (total === 0) return null;
        if (merged.length > 5) return { label: "Elite Architect", desc: "Proven record of merged production code", icon: "💎" };
        if (prs.length > 3) return { label: "Active Deployer", desc: "High frequency of engineering proposals", icon: "🚀" };
        if (issues.length > prs.length) return { label: "Systems Guardian", desc: "Focused on architectural integrity and bug tracking", icon: "🛡️" };
        return { label: "OS Voyager", desc: "Beginning the journey into the global ecosystem", icon: "🛰️" };
    }, [prs, issues, merged]);

    const maxItems = Math.max(prs.length, issues.length, merged.length, 1);
    const displayThreshold = 12;
    const totalRows = Math.min(maxItems, displayThreshold);
    const rowIndices = Array.from({ length: totalRows }, (_, i) => i);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
                <div className="fixed inset-0 z-0">
                    <WavyBackground backgroundFill="black" containerClassName="h-full w-full" />
                </div>
                <MultiStepLoader
                    loadingStates={[
                        { text: "Establishing Satellite Link" },
                        { text: "Scanning Global Open Source Grid" },
                        { text: "Intercepting Neural PR Vectors" },
                        { text: "Mapping Historical Contributions" },
                    ]}
                    loading={loading}
                    duration={800}
                />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black overflow-y-auto">
            <AnimatePresence>
                {isSimulated && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-violet-600/90 text-white py-2 px-6 fixed top-0 left-0 w-full z-50 backdrop-blur-md flex items-center justify-between border-b border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <Info className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural_Simulation_Mode :: API_Uplink_Limited</span>
                        </div>
                        <button onClick={() => window.location.reload()} className="text-[9px] font-black underline hover:text-white/80 flex items-center gap-2">
                             <RefreshCcw className="w-3 h-3" /> Sync_Matrix
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed inset-0 z-0 pointer-events-none">
                <WavyBackground
                    backgroundFill="black"
                    colors={["#8b5cf6", "#6366f1", "#0ea5e9", "#14b8a6", "#3b82f6"]}
                    waveWidth={30}
                    containerClassName="h-full w-full"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto pt-24 pb-12 px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                    <button
                        onClick={() => router.push("/explore")}
                        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group px-4 py-2 bg-white/5 rounded-xl border border-white/5 backdrop-blur-md shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Return to Tactical Overview</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                            <Github className="w-4 h-4 text-white" />
                            <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest truncate max-w-[150px] md:max-w-none">Node_ID: {username}</span>
                        </div>
                        <button
                            onClick={() => router.push("/opensource/track")}
                            className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl font-black transition-all shadow-lg shadow-violet-500/20 active:scale-95 text-[10px] uppercase tracking-widest flex items-center gap-2 shrink-0"
                        >
                            <RefreshCcw className="w-3.5 h-3.5" />
                            New Mission
                        </button>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12 pb-32"
                >
                    <div className="text-center space-y-8">
                        <div className="inline-block">
                            <Cover className="bg-transparent dark:bg-transparent">
                                <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic px-8 py-4 leading-none">
                                    CONTRIBUTION <span className="text-violet-500">OVERVIEW</span>
                                </h1>
                            </Cover>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-12 bg-linear-to-r from-transparent to-violet-500/50" />
                            <p className="text-neutral-500 font-mono uppercase tracking-[0.4em] text-[10px] italic">Tactical Behavioral Diagnostic System</p>
                            <div className="h-px w-12 bg-linear-to-l from-transparent to-violet-500/50" />
                        </div>
                    </div>

                    {/* Neural Analytics Dashboard */}
                    {!error && (prs.length > 0 || issues.length > 0 || merged.length > 0) && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Achievement Card */}
                            <div className="bg-black/40 border border-white/10 rounded-4xl p-10 backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
                                <GlowingEffect
                                    blur={30}
                                    borderWidth={2}
                                    spread={100}
                                    glow={true}
                                    disabled={false}
                                    proximity={100}
                                    inactiveZone={0.01}
                                />
                                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 blur-sm">
                                    <Zap size={140} className="text-violet-500" />
                                </div>
                                <div className="absolute inset-x-0 h-px top-1/4 bg-linear-to-r from-transparent via-violet-500/20 to-transparent animate-pulse" />
                                
                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-start gap-6">
                                        <motion.div 
                                            whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                                            className="text-6xl group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-500"
                                        >
                                            {achievement?.icon}
                                        </motion.div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-ping" />
                                                <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em] font-mono">NEURAL_CLASS_L4</p>
                                            </div>
                                            <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{achievement?.label}</h3>
                                        </div>
                                    </div>
                                    
                                    <p className="text-neutral-400 text-sm italic leading-relaxed font-medium bg-black/20 p-4 rounded-2xl border border-white/5">
                                        "{achievement?.desc}. Profile analysis indicates stable contribution trajectory in the {repoStats[0]?.name.split('/')[1] || "target"} sector."
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {["Verified", "Strategic", "Locked"].map(tag => (
                                            <span key={tag} className="px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-[9px] font-black uppercase text-violet-400 tracking-widest shadow-lg shadow-black/20 backdrop-blur-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                             {/* Repo Distribution */}
                            <div className="bg-black/40 border border-white/10 rounded-4xl p-10 backdrop-blur-3xl space-y-8 lg:col-span-2 overflow-hidden shadow-2xl relative">
                                <GlowingEffect
                                    blur={40}
                                    borderWidth={1}
                                    spread={80}
                                    glow={true}
                                    disabled={false}
                                    proximity={120}
                                    inactiveZone={0.01}
                                />
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="space-y-2">
                                        <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic">Node Integrity Distribution</h4>
                                        <div className="flex items-center gap-3">
                                            <div className="h-px w-8 bg-violet-500/50" />
                                            <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.4em] font-black">Global_Grid_Impact_Radius</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full backdrop-blur-md">
                                        <motion.div 
                                            animate={{ scale: [1, 1.5, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
                                        />
                                        <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">Uplink_Active</span>
                                    </div>
                                </div>

                                <div className="h-[200px] w-full relative z-10 -ml-4">
                                    <ResponsiveContainer width="110%" height="100%">
                                        <BarChart data={repoStats} layout="vertical" margin={{ left: -30 }}>
                                            <XAxis type="number" hide />
                                            <YAxis 
                                                dataKey="name" 
                                                type="category" 
                                                width={180} 
                                                tick={({ x, y, payload }) => (
                                                    <g transform={`translate(${x},${y})`}>
                                                        <text 
                                                            x={0} 
                                                            y={0} 
                                                            dy={4} 
                                                            textAnchor="end" 
                                                            fill="#666" 
                                                            fontSize="10" 
                                                            fontWeight="900" 
                                                            className="font-mono uppercase tracking-tighter italic"
                                                        >
                                                            {payload.value.length > 25 ? payload.value.substring(0, 22) + "..." : payload.value}
                                                        </text>
                                                    </g>
                                                )}
                                                axisLine={false} 
                                                tickLine={false} 
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                                contentStyle={{ 
                                                    backgroundColor: 'rgba(0,0,0,0.9)', 
                                                    border: '1px solid rgba(139, 92, 246, 0.3)', 
                                                    fontSize: '11px', 
                                                    borderRadius: '16px',
                                                    backdropFilter: 'blur(20px)',
                                                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                                    fontWeight: '800'
                                                }}
                                                itemStyle={{ color: '#a78bfa' }}
                                            />
                                            <Bar 
                                                dataKey="count" 
                                                fill="url(#barGradient)" 
                                                radius={[0, 8, 8, 0]} 
                                                barSize={20}
                                                animationDuration={2000}
                                                animationEasing="ease-out"
                                            />
                                            <defs>
                                                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#6366f1" />
                                                    <stop offset="50%" stopColor="#8b5cf6" />
                                                    <stop offset="100%" stopColor="#d946ef" />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/5 border border-red-500/10 text-red-500 p-12 rounded-4xl text-center backdrop-blur-3xl max-w-2xl mx-auto shadow-2xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                            <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-500/50 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-black mb-3 uppercase italic tracking-tighter">Analysis Failure</h3>
                            <p className="opacity-60 text-sm font-mono uppercase tracking-widest leading-relaxed">{error}</p>
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button onClick={() => window.location.reload()} className="px-10 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl font-mono">Retry_Uplink</button>
                                <button
                                    onClick={() => {
                                        setPrs(MOCK_CONTRIBUTIONS(username, 'pr'));
                                        setIssues(MOCK_CONTRIBUTIONS(username, 'issue'));
                                        setMerged(MOCK_CONTRIBUTIONS(username, 'merged'));
                                        setIsSimulated(true);
                                        setError(null);
                                    }}
                                    className="px-8 py-4 bg-white/5 border border-white/10 text-neutral-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all shadow-2xl"
                                >
                                    Launch_Simulation
                                </button>
                            </div>
                        </div>
                    )}

                    {!error && (
                        <>
                            {/* Synchronized Header Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sticky top-4 z-40 mb-12 px-3 py-3 bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/5 shadow-2xl">
                                <Header title="Inbound Vectors" count={prs.length} icon={<GitPullRequest className="text-blue-500 w-5 h-5" />} />
                                <Header title="System Alerts" count={issues.length} icon={<AlertCircle className="text-yellow-500 w-5 h-5" />} />
                                <Header title="Resolved Nodes" count={merged.length} icon={<GitMerge className="text-purple-500 w-5 h-5" />} />
                            </div>

                            {/* Synchronized Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {rowIndices.map((rowIndex) => (
                                    <React.Fragment key={`row-${rowIndex}`}>
                                    <div className="flex flex-col aspect-3/2 w-full">
                                            {prs[rowIndex] ? <ContributionCard contribution={prs[rowIndex]} type="pr" /> : <GhostCard type="Inbound" />}
                                        </div>
                                        <div className="flex flex-col aspect-3/2 w-full">
                                            {issues[rowIndex] ? <ContributionCard contribution={issues[rowIndex]} type="Alert" /> : <GhostCard type="Alert" />}
                                        </div>
                                        <div className="flex flex-col aspect-3/2 w-full">
                                            {merged[rowIndex] ? <ContributionCard contribution={merged[rowIndex]} type="Resolved" /> : <GhostCard type="Resolved" />}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            {(prs.length === 0 && issues.length === 0 && merged.length === 0) && (
                                <div className="p-24 border border-white/5 rounded-[4rem] bg-black/40 backdrop-blur-3xl text-center max-w-3xl mx-auto shadow-2xl">
                                    <Github className="w-16 h-16 text-neutral-800 mx-auto mb-8" />
                                    <p className="text-neutral-500 text-2xl font-black italic uppercase tracking-tighter mb-2">Zero Drift Detected</p>
                                    <p className="text-neutral-700 text-[10px] font-black uppercase tracking-[0.4em]">Node currently dormant in open source sectors</p>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

function Header({ title, count, icon }: { title: string, count: number, icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-5 p-4 hover:bg-white/5 rounded-2xl transition-all shrink-0 group">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0 group-hover:scale-110 group-hover:bg-white/10 transition-all">
                {icon}
            </div>
            <div className="flex flex-col min-w-0">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">{title}</h3>
                <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mt-1 font-bold">{count.toString().padStart(2, '0')} INTERCEPTS</p>
            </div>
        </div>
    );
}

function GhostCard({ type }: { type: string }) {
    return (
        <div className="w-full h-full border border-white/5 rounded-4xl bg-black/40 backdrop-blur-md flex items-center justify-center group/ghost relative overflow-hidden transition-all duration-700 hover:bg-white/5">
            <div className="absolute inset-0 bg-linear-to-br from-white/2 via-transparent to-transparent" />
            <div className="flex flex-col items-center gap-3 opacity-10 group-hover/ghost:opacity-30 transition-all duration-500 scale-90 group-hover/ghost:scale-100">
                <Plus className="w-10 h-10 text-neutral-500" strokeWidth={1} />
                <span className="text-[10px] text-neutral-600 font-black uppercase tracking-[0.4em]">
                    End_of_{type}
                </span>
            </div>
        </div>
    );
}

function ContributionCard({ contribution, type }: { contribution: Contribution; type: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useOutsideClick(cardRef as React.RefObject<HTMLDivElement>, () => setIsExpanded(false));

    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isExpanded]);

    return (
        <>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsExpanded(false)}
                        className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-100 flex items-center justify-center p-6 cursor-zoom-out"
                    >
                        <motion.div
                            layoutId={`card-${contribution.id}`}
                            ref={cardRef}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black border border-white/10 rounded-4xl p-10 max-w-3xl w-full shadow-2xl relative overflow-hidden cursor-default"
                        >
                            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                                <SparklesCore
                                    id={`sparkles-${contribution.id}`}
                                    background="transparent"
                                    minSize={0.4}
                                    maxSize={1}
                                    particleDensity={40}
                                    className="w-full h-full"
                                    particleColor="#FFFFFF"
                                />
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(false);
                                }}
                                className="absolute top-8 right-8 p-3 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all z-50 group/close active:scale-95 flex items-center justify-center hover:rotate-90 shadow-2xl"
                            >
                                <X className="w-6 h-6 text-neutral-500 group-hover:text-white transition-colors" />
                            </button>

                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                                        {type === "pr" ? (
                                            <GitPullRequest className="w-8 h-8 text-blue-400" />
                                        ) : type === "issue" ? (
                                            <AlertCircle className="w-8 h-8 text-yellow-400" />
                                        ) : (
                                            <GitMerge className="w-8 h-8 text-purple-400" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.3em] font-mono leading-none">
                                            {contribution.repo_name || "Repository"}
                                        </h4>
                                        <span className="text-xs text-neutral-700 font-mono font-bold tracking-widest">TRACE_NODE_#{contribution.number}</span>
                                    </div>
                                </div>

                                <motion.p
                                    layoutId={`title-${contribution.id}`}
                                    className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tighter uppercase italic"
                                >
                                    {contribution.title}
                                </motion.p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-3xl">
                                        <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] font-black mb-2 font-mono">Status_Code</p>
                                        <p className="text-lg font-black text-white uppercase italic tracking-tighter">{contribution.state}</p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-3xl">
                                        <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] font-black mb-2 font-mono">Inbound_Epoch</p>
                                        <p className="text-lg font-black text-white italic tracking-tighter">
                                            {new Date(contribution.created_at).toLocaleDateString(undefined, {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }).toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <a
                                        href={contribution.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-neutral-200 active:scale-[0.98] shadow-2xl group/link"
                                    >
                                        Intercept Asset on GitHub
                                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                layoutId={`card-${contribution.id}`}
                onClick={() => setIsExpanded(true)}
                className="cursor-pointer group h-full w-full"
            >
                <GlareCard
                    containerClassName="!w-full !h-full ![aspect-ratio:3/2] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-4xl!"
                    className="flex flex-col items-start justify-between p-7 h-full rounded-4xl! relative overflow-hidden"
                >
                    <GlowingEffect
                        blur={20}
                        borderWidth={1}
                        spread={60}
                        glow={true}
                        disabled={false}
                        proximity={80}
                        inactiveZone={0.01}
                    />
                    <div className="relative z-10 w-full flex flex-col h-full justify-between">
                        <div className="w-full flex justify-between items-start mb-6">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-all group-hover:scale-110 shadow-2xl shrink-0">
                                {type === "pr" ? (
                                    <GitPullRequest className="w-5 h-5 text-blue-400" />
                                ) : type === "issue" ? (
                                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                                ) : (
                                    <GitMerge className="w-5 h-5 text-purple-400" />
                                )}
                            </div>
                            <span className="text-[9px] text-neutral-600 uppercase tracking-tighter font-black font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 group-hover:border-white/10 transition-colors">
                                #{contribution.number}
                            </span>
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            <h4 className="text-[9px] text-neutral-500 font-black uppercase tracking-[0.2em] line-clamp-1 border-b border-white/5 pb-2 font-mono">
                                {contribution.repo_name || "Repository"}
                            </h4>
                            <motion.p
                                layoutId={`title-${contribution.id}`}
                                className="text-white text-base font-black leading-tight line-clamp-2 group-hover:text-violet-400 transition-colors duration-500 uppercase italic tracking-tighter"
                            >
                                {contribution.title}
                            </motion.p>
                        </div>

                        <div className="w-full pt-4 mt-6 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[9px] text-neutral-600 font-black uppercase tracking-[0.2em] font-mono">
                                {new Date(contribution.created_at).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: '2-digit'
                                }).toUpperCase()}
                            </span>
                            <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-all">
                                <span className="text-[9px] text-violet-500 font-black uppercase tracking-widest">Intercept</span>
                                <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Search className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </GlareCard>
            </motion.div>
        </>
    );
}
