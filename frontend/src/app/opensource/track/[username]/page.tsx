"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { GlareCard } from "@/components/ui/glare-card";
import { GitPullRequest, GitMerge, AlertCircle, Search, ArrowLeft, X, ExternalLink, Plus, RefreshCcw, Github } from "lucide-react";
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
    Cell,
    PieChart,
    Pie
} from 'recharts';

import { Cover } from "@/components/ui/cover";

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

export default function TrackerResultsPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;

    const [prs, setPrs] = useState<Contribution[]>([]);
    const [issues, setIssues] = useState<Contribution[]>([]);
    const [merged, setMerged] = useState<Contribution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (username) {
            fetchContributions(username);
        }
    }, [username]);

    const fetchContributions = async (user: string) => {
        setLoading(true);
        setError(null);
        try {
            const [prsRes, issuesRes, mergedRes] = await Promise.all([
                fetch(`https://api.github.com/search/issues?q=author:${user}+type:pr+state:open`),
                fetch(`https://api.github.com/search/issues?q=author:${user}+type:issue`),
                fetch(`https://api.github.com/search/issues?q=author:${user}+type:pr+is:merged`),
            ]);

            // Check for rate limits or other common errors
            if (prsRes.status === 403 || issuesRes.status === 403 || mergedRes.status === 403) {
                throw new Error("GitHub API rate limit exceeded. Please wait a minute and try again.");
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

    // Synchronize rows for perfect horizontal alignment
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
                        { text: "Connecting to GitHub APIs" },
                        { text: "Gathering Pull Requests" },
                        { text: "Finding issues" },
                        { text: "Locating Merged Results" },
                    ]}
                    loading={loading}
                    duration={500}
                />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black overflow-y-auto">
            {/* Background Layer */}
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
                        onClick={() => router.push("/opensource/track")}
                        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group px-4 py-2 bg-white/5 rounded-xl border border-white/5 backdrop-blur-md shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Search</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                            <Github className="w-4 h-4 text-white" />
                            <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest truncate max-w-[150px] md:max-w-none">Analysis: {username}</span>
                        </div>
                        <button
                            onClick={() => router.push("/opensource/track")}
                            className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/20 active:scale-95 text-xs uppercase tracking-widest flex items-center gap-2 shrink-0"
                        >
                            <RefreshCcw className="w-3.5 h-3.5" />
                            New Search
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
                                <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic px-8 py-4">
                                    CONTRIBUTION <span className="text-violet-500 text-glow-violet">OVERVIEW</span>
                                </h1>
                            </Cover>
                        </div>
                        <p className="text-neutral-500 font-mono uppercase tracking-[0.3em] text-sm italic">Synchronized GitHub Intelligence</p>
                    </div>

                    {/* Neural Analytics Dashboard */}
                    {!error && (prs.length > 0 || issues.length > 0 || merged.length > 0) && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Achievement Card */}
                            <div className="bg-white/2 border border-white/10 rounded-4xl p-10 backdrop-blur-3xl relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-5xl">{achievement?.icon}</div>
                                        <div>
                                            <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest leading-none mb-2">Neural_Class</p>
                                            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{achievement?.label}</h3>
                                        </div>
                                    </div>
                                    <p className="text-neutral-400 text-sm italic leading-relaxed">
                                        {achievement?.desc}. Profile analysis indicates stable contribution trajectory in the {repoStats[0]?.name.split('/')[1] || "target"} sector.
                                    </p>
                                    <div className="flex gap-2">
                                        {["Verified", "Level_04", "Strategic"].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase text-neutral-500">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Repo Distribution */}
                            <div className="bg-white/2 border border-white/10 rounded-4xl p-8 backdrop-blur-3xl space-y-6 lg:col-span-2 overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Node Distribution</h4>
                                        <p className="text-[9px] font-mono text-neutral-600 uppercase">Top_5_Impact_Sectors</p>
                                    </div>
                                    <RefreshCcw size={14} className="text-neutral-700" />
                                </div>
                                <div className="h-[120px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={repoStats} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 9, fill: '#666', fontWeight: 900 }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', fontSize: '10px' }}
                                                itemStyle={{ color: '#8b5cf6' }}
                                            />
                                            <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={12} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-3xl text-center backdrop-blur-md max-w-2xl mx-auto">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold mb-2">Analysis Error</h3>
                            <p className="opacity-80">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-6 text-sm font-black underline uppercase tracking-widest">Try Again</button>
                        </div>
                    )}

                    {!error && (
                        <>
                            {/* Synchronized Header Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sticky top-4 z-20 mb-12 px-2 py-2 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl">
                                <Header title="Open PRs" count={prs.length} icon={<GitPullRequest className="text-blue-500 w-5 h-5" />} />
                                <Header title="Active Issues" count={issues.length} icon={<AlertCircle className="text-yellow-500 w-5 h-5" />} />
                                <Header title="Merged Contributions" count={merged.length} icon={<GitMerge className="text-purple-500 w-5 h-5" />} />
                            </div>

                            {/* Synchronized Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {rowIndices.map((rowIndex) => (
                                    <React.Fragment key={`row-${rowIndex}`}>
                                        <div className="flex flex-col aspect-ratio-[3/2] w-full">
                                            {prs[rowIndex] ? <ContributionCard contribution={prs[rowIndex]} type="pr" /> : <GhostCard type="pr" />}
                                        </div>
                                        <div className="flex flex-col aspect-ratio-[3/2] w-full">
                                            {issues[rowIndex] ? <ContributionCard contribution={issues[rowIndex]} type="issue" /> : <GhostCard type="issue" />}
                                        </div>
                                        <div className="flex flex-col aspect-ratio-[3/2] w-full">
                                            {merged[rowIndex] ? <ContributionCard contribution={merged[rowIndex]} type="merged" /> : <GhostCard type="merged" />}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            {(prs.length === 0 && issues.length === 0 && merged.length === 0) && (
                                <div className="p-24 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-2xl text-center max-w-3xl mx-auto">
                                    <Github className="w-16 h-16 text-neutral-800 mx-auto mb-6" />
                                    <p className="text-neutral-400 text-xl font-bold italic uppercase tracking-widest mb-2">Ghost Profile Detected</p>
                                    <p className="text-neutral-600 text-sm">No recent open-source contributions found for this user.</p>
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
        <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors shrink-0 group">
            <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="flex flex-col min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{title}</h3>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-black mt-0.5">{count} entries</p>
            </div>
        </div>
    );
}

function GhostCard({ type }: { type: string }) {
    return (
        <div className="w-full h-full border border-white/5 rounded-[48px] bg-white/1 flex items-center justify-center group/ghost relative overflow-hidden transition-all duration-500 hover:bg-white/3">
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/ghost:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center gap-2 opacity-20 group-hover/ghost:opacity-40 transition-all duration-300 scale-90 group-hover/ghost:scale-100">
                <Plus className="w-6 h-6 text-neutral-500" strokeWidth={1} />
                <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.3em]">
                    No {type}
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
                        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-100 flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <motion.div
                            layoutId={`card-${contribution.id}`}
                            ref={cardRef}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden cursor-default"
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
                                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-all z-50 group/close active:scale-95 flex items-center justify-center hover:rotate-90"
                            >
                                <X className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                            </button>

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                        {type === "pr" ? (
                                            <GitPullRequest className="w-6 h-6 text-blue-400" />
                                        ) : type === "issue" ? (
                                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                                        ) : (
                                            <GitMerge className="w-6 h-6 text-purple-400" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-xs text-neutral-500 font-black uppercase tracking-[0.2em]">
                                            {contribution.repo_name || "Repository"}
                                        </h4>
                                        <span className="text-xs text-neutral-600 font-mono">#{contribution.number}</span>
                                    </div>
                                </div>

                                <motion.p
                                    layoutId={`title-${contribution.id}`}
                                    className="text-2xl font-bold text-white leading-tight"
                                >
                                    {contribution.title}
                                </motion.p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black mb-1">Status</p>
                                        <p className="text-sm font-bold text-white uppercase">{contribution.state}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black mb-1">Created At</p>
                                        <p className="text-sm font-bold text-white">
                                            {new Date(contribution.created_at).toLocaleDateString(undefined, {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <a
                                        href={contribution.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/20 group/link"
                                    >
                                        View on GitHub
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
                    containerClassName="!w-full !h-full ![aspect-ratio:3/2] shadow-2xl"
                    className="flex flex-col items-start justify-between p-5 h-full"
                >
                    <div className="w-full flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/10 rounded border border-white/10 group-hover:bg-white/20 transition-colors">
                            {type === "pr" ? (
                                <GitPullRequest className="w-4 h-4 text-blue-400" />
                            ) : type === "issue" ? (
                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                            ) : (
                                <GitMerge className="w-4 h-4 text-purple-400" />
                            )}
                        </div>
                        <span className="text-[9px] text-neutral-500 uppercase tracking-tighter font-black font-mono">
                            #{contribution.number}
                        </span>
                    </div>

                    <div className="flex-1 w-full space-y-3">
                        <h4 className="text-[9px] text-neutral-500 font-black uppercase tracking-widest line-clamp-1 border-b border-white/5 pb-1.5">
                            {contribution.repo_name || "Repository"}
                        </h4>
                        <motion.p
                            layoutId={`title-${contribution.id}`}
                            className="text-white text-sm font-bold leading-tight line-clamp-2 group-hover:text-violet-400 transition-colors duration-300"
                        >
                            {contribution.title}
                        </motion.p>
                    </div>

                    <div className="w-full pt-3 mt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest">
                            {new Date(contribution.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <span className="text-[8px] text-violet-400 font-black uppercase tracking-widest">EXPAND</span>
                            <div className="w-5 h-5 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                                <Search className="w-2.5 h-2.5 text-violet-400" />
                            </div>
                        </div>
                    </div>
                </GlareCard>
            </motion.div>
        </>
    );
}
