"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { IconBrandGithub, IconArrowLeft, IconGitCommit, IconUsers, IconBrain } from "@tabler/icons-react";
import { Sparkles } from "lucide-react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { cn } from "@/lib/utils";

interface Commit {
    sha: string;
    html_url: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
    author?: {
        avatar_url: string;
        login: string;
    };
}

export default function RepositoryCommitsPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;
    const repoName = params.repo as string;

    const [commits, setCommits] = useState<Commit[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filterAuthor, setFilterAuthor] = useState<string | null>(null);

    const [isSimulated, setIsSimulated] = useState(false);

    const MOCK_COMMITS = (user: string, repo: string) => {
        const hash = (s: string) => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
        const h = Math.abs(hash(user + repo));
        
        const messages = [
            "feat: implement neural optimization vector",
            "fix: resolved architectural drift in nexus-kernel",
            "chore: database-uplink transition to v2.4",
            "update: sentinel-api protocol buffers",
            "feat: distributed-consensus logic refactor",
            "docs: structural documentation for asset-mapping",
            "feat: vortex-ui rendering pipeline upgrade",
            "fix: global-dependency resolution patch"
        ];

        return Array.from({ length: 20 }).map((_, i) => ({
            sha: Math.random().toString(16).substring(2, 42),
            html_url: `https://github.com/${user}/${repo}`,
            commit: {
                message: messages[i % messages.length],
                author: {
                    name: user,
                    date: new Date(Date.now() - (i * 3600000 * 2)).toISOString()
                }
            },
            author: {
                avatar_url: `https://avatars.githubusercontent.com/u/${(h + i) % 50000}?v=4`,
                login: user
            }
        }));
    };

    const fetchCommits = async (p: number, append = false) => {
        if (p === 1) setLoading(true);
        else setLoadingMore(true);
        setError(null);
        setIsSimulated(false);

        try {
            const res = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=30&page=${p}`);
            
            if (res.status === 403) {
                console.warn("API Rate Limit Reached. Activating Neural Simulation.");
                const data = MOCK_COMMITS(username, repoName);
                setCommits(prev => append ? [...prev, ...data] : data);
                setIsSimulated(true);
                setHasMore(false);
                setLoading(false);
                setLoadingMore(false);
                return;
            }

            if (!res.ok) {
                if (res.status === 404) throw new Error("Repository or commits not found.");
                if (res.status === 409) throw new Error("Repository is empty.");
                throw new Error(`Failed to fetch commits (${res.status})`);
            }
            const data = await res.json();
            if (data.length < 30) setHasMore(false);
            setCommits(prev => append ? [...prev, ...data] : data);
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching commits.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (!username || !repoName) return;
        fetchCommits(1);
    }, [username, repoName]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchCommits(nextPage, true);
    };

    const handleBack = () => {
        router.push("/explore");
    };

    // Keyword highlighting for commit messages
    const HighlightedMessage = ({ message }: { message: string }) => {
        const keywords = {
            merge: "text-blue-400 font-black",
            fix: "text-red-400 font-black",
            add: "text-emerald-400 font-black",
            update: "text-amber-400 font-black",
            chore: "text-neutral-500 font-mono",
            feature: "text-fuchsia-400 font-black",
            feat: "text-fuchsia-400 font-black",
        };

        const parts = message.split(/(\s+)/);
        return (
            <span className="leading-snug">
                {parts.map((part, i) => {
                    const lower = part.toLowerCase().replace(/[^a-z]/g, "");
                    const className = keywords[lower as keyof typeof keywords];
                    return className ? (
                        <span key={i} className={className}>{part}</span>
                    ) : (
                        <span key={i}>{part}</span>
                    );
                })}
            </span>
        );
    };

    // Format date roughly relative (e.g., "Oct 12, 2023, 14:30")
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    // Calculate author statistics
    const authorStats = useMemo(() => {
        const stats: Record<string, { count: number; avatar: string }> = {};
        commits.forEach(c => {
            const name = c.commit.author.name;
            const avatar = c.author?.avatar_url || "";
            if (!stats[name]) {
                stats[name] = { count: 0, avatar };
            }
            stats[name].count++;
        });
        return Object.entries(stats)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 10);
    }, [commits]);

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pt-24 relative overflow-hidden">
            <AnimatePresence>
                {isSimulated && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-violet-600/90 text-white py-2 px-6 fixed top-0 left-0 w-full z-50 backdrop-blur-md flex items-center justify-between border-b border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural_Simulation_Mode :: API_Uplink_Limited</span>
                        </div>
                        <button onClick={() => window.location.reload()} className="text-[9px] font-black underline hover:text-white/80">Sync_Matrix</button>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* BACKGROUND INFRASTRUCTURE */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#00e676]/5 rounded-full blur-[150px] pointer-events-none opacity-50" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="w-full flex justify-start mb-12">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full w-fit backdrop-blur-md border border-white/5"
                    >
                        <IconArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Explore</span>
                    </button>
                </div>

                <div className="w-full bg-black border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[85vh] max-h-[900px] overflow-hidden ring-1 ring-white/5">

                    {/* Header Title area */}
                    <div className="px-8 py-8 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/[0.02] relative overflow-hidden group/header">
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover/header:rotate-12 transition-transform duration-1000">
                            <IconGitCommit size={120} />
                        </div>
                        <div className="flex items-start gap-6 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#00e676] to-emerald-600 flex items-center justify-center text-black shadow-[0_0_30px_rgba(0,230,118,0.3)]">
                                <Sparkles size={32} />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-[#00e676]/10 border border-[#00e676]/20 rounded text-[9px] font-black text-[#00e676] uppercase tracking-widest">Neural_Repository_Scan</span>
                                    <div className="w-1 h-1 bg-neutral-800 rounded-full" />
                                    <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">v2.4_Stable</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-white flex items-center gap-2 flex-wrap tracking-tighter uppercase italic">
                                    <span className="text-neutral-500 font-normal">{username}</span>
                                    <span className="text-neutral-700">/</span>
                                    <span className="text-[#00e676]">{repoName}</span>
                                </h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <IconGitCommit className="w-4 h-4 text-neutral-500" />
                                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-none">
                                            {filterAuthor ? `Intercepting ${filterAuthor}` : 'Full Timeline'}
                                        </span>
                                    </div>
                                    <div className="w-1 h-1 bg-neutral-800 rounded-full" />
                                    <div className="text-xs font-mono text-neutral-500">{commits.length} DATA_NODES</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 relative z-10">
                            <a
                                href={`https://github.com/${username}/${repoName}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3 text-[#00e676] bg-[#00e676]/5 border border-[#00e676]/10 hover:bg-[#00e676]/10 rounded-xl transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                            >
                                <IconBrandGithub className="w-4 h-4" />
                                Archive
                            </a>
                            {filterAuthor && (
                                <button 
                                    onClick={() => setFilterAuthor(null)}
                                    className="px-6 py-3 text-red-400 bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
                                >
                                    Reset_Channel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="flex-1 flex overflow-hidden bg-black relative">
                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <MultiStepLoader
                                    loading={loading}
                                    duration={400}
                                    loadingStates={[
                                        { text: "Connecting to GitHub API" },
                                        { text: "Fetching repository data" },
                                        { text: "Scanning commit history" },
                                        { text: "Aggregating authorship" },
                                        { text: "Generating timeline" },
                                    ]}
                                />
                            </div>
                        ) : error ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 font-bold text-2xl">!</div>
                                <h3 className="text-xl font-bold text-white mb-2 italic">Failed to Intercept</h3>
                                <p className="text-neutral-400 mb-6 max-w-xs">{error}</p>
                                <button onClick={() => fetchCommits(1)} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">Retry_Scan</button>
                            </div>
                        ) : commits.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-neutral-400">
                                <IconBrandGithub className="w-16 h-16 text-neutral-800 mb-4" />
                                <p className="text-lg font-black uppercase italic tracking-tighter">No Data Nodes Found</p>
                            </div>
                        ) : (
                            <>
                                {/* Left Side: Scrollable Timeline */}
                                <div className="flex-1 overflow-y-auto p-4 md:p-8 md:pl-10 border-r border-white/5 relative scrollbar-hide">
                                    <div className="absolute left-9 md:left-[3.15rem] top-0 bottom-0 w-px bg-linear-to-b from-[#00e676]/20 via-[#00e676]/5 to-transparent shadow-[0_0_10px_rgba(0,230,118,0.1)]" />
                                    
                                    <div className="relative space-y-8 pb-4">
                                        {commits.filter(c => !filterAuthor || c.commit.author.name === filterAuthor).map((commitData) => (
                                            <motion.a
                                                key={commitData.sha}
                                                href={commitData.html_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="relative flex flex-col sm:flex-row gap-5 group p-6 md:p-8 md:-ml-[2.8rem] -ml-10 rounded-[2.5rem] hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/10 hover:shadow-2xl hover:shadow-[#00e676]/5 active:scale-[0.99]"
                                            >
                                                {/* Timeline dot */}
                                                <div className="absolute left-[34px] md:left-[38px] top-[42px] w-2.5 h-2.5 rounded-full bg-neutral-900 border-2 border-neutral-700 group-hover:bg-[#00e676] group-hover:border-[#00e676] group-hover:scale-125 transition-all duration-300 z-10 shadow-[0_0_15px_rgba(0,230,118,0)] group-hover:shadow-[0_0_15px_rgba(0,230,118,0.5)]" />
                                                
                                                {/* Author Avatar with Glow */}
                                                <div className="flex items-center sm:items-start shrink-0 pl-16 sm:pl-0 sm:w-16 pt-1 relative z-10">
                                                    {commitData.author?.avatar_url ? (
                                                        <div className="relative">
                                                            <Image
                                                                src={commitData.author.avatar_url}
                                                                alt={commitData.commit.author.name}
                                                                width={52}
                                                                height={52}
                                                                className="rounded-2xl shadow-xl border border-white/10 bg-neutral-900 group-hover:border-[#00e676]/50 transition-colors"
                                                            />
                                                            <div className="absolute -inset-1 bg-[#00e676]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-white/10 flex items-center justify-center text-lg font-bold text-neutral-400 shadow-lg group-hover:border-[#00e676]/50 transition-colors">
                                                            {commitData.commit.author.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0 pl-16 sm:pl-0 relative z-10">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
                                                        <p className="text-white font-black text-lg md:text-xl leading-snug tracking-tighter group-hover:text-[#00e676] transition-colors italic uppercase">
                                                            <HighlightedMessage message={commitData.commit.message.split('\n')[0]} />
                                                        </p>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span className="font-mono text-[10px] text-neutral-500 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 group-hover:border-[#00e676]/20 transition-colors">
                                                                {commitData.sha.substring(0, 8)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {commitData.commit.message.includes('\n') && (
                                                        <p className="text-neutral-400 text-sm line-clamp-3 mb-3 bg-white/5 p-3 rounded-xl border border-white/5 hidden sm:block">
                                                            {commitData.commit.message.split('\n').slice(1).join('\n').trim()}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-3 text-xs text-neutral-500 font-bold uppercase tracking-widest mt-4 pt-4 border-t border-white/[0.03]">
                                                        <span className="text-[#00e676] italic">{commitData.commit.author.name}</span>
                                                        <div className="w-1 h-1 rounded-full bg-neutral-800" />
                                                        <span className="text-neutral-600 font-mono tracking-tighter">{formatDate(commitData.commit.author.date)}</span>
                                                    </div>
                                                </div>
                                            </motion.a>
                                        ))}

                                        {hasMore && !loading && commits.length > 0 && (
                                            <div className="pt-8 pb-4 flex justify-center -ml-16 relative">
                                                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -z-10" />
                                                <button
                                                    onClick={loadMore}
                                                    disabled={loadingMore}
                                                    className="px-10 py-4 bg-black border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#00e676] hover:bg-[#00e676] hover:text-black transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_30px_rgba(0,230,118,0.1)]"
                                                >
                                                    {loadingMore ? "Interrogating_API..." : "Interrogate_Next_Buffer"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Sidebar: Authorship Stats */}
                                <div className="w-80 hidden lg:flex flex-col bg-white/[0.02] p-6 space-y-6 shrink-0">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[#00e676]">
                                            <IconUsers size={18} />
                                            <h4 className="text-xs font-black uppercase tracking-widest leading-none">Neural Contribs</h4>
                                        </div>
                                        <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest">Aggregate_Node_Data</p>
                                    </div>

                                    <div className="space-y-4">
                                        {authorStats.map(([name, data], i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setFilterAuthor(filterAuthor === name ? null : name)}
                                                className={cn(
                                                    "w-full flex items-center justify-between group p-3 rounded-2xl transition-all border",
                                                    filterAuthor === name ? "bg-[#00e676]/10 border-[#00e676]/20" : "bg-white/[0.02] border-transparent hover:border-white/10 hover:bg-white/[0.04]"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {data.avatar ? (
                                                        <Image src={data.avatar} alt={name} width={32} height={32} className="rounded-xl border border-white/10" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-neutral-500">
                                                            {name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="max-w-[120px] text-left">
                                                        <p className="text-xs font-black text-neutral-300 truncate group-hover:text-white transition-colors uppercase tracking-tight italic">{name}</p>
                                                        <div className="w-full bg-white/5 h-1 rounded-full mt-1.5 overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(data.count / commits.length) * 100}%` }}
                                                                className="h-full bg-linear-to-r from-[#00e676] to-emerald-400 shadow-[0_0_8px_rgba(0,230,118,0.5)]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-white italic leading-none">{data.count}</p>
                                                    <p className="text-[8px] text-neutral-600 font-black uppercase tracking-tighter mt-1">NODES</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-white/5">
                                         <div className="bg-[#00e676]/5 border border-[#00e676]/10 rounded-2xl p-5 relative overflow-hidden group/insight">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/insight:rotate-12 transition-transform">
                                                <IconBrain size={40} />
                                            </div>
                                            <p className="text-[10px] font-black text-[#00e676] uppercase tracking-[0.2em] mb-2">Architectural Insight</p>
                                            <p className="text-[11px] text-neutral-400 font-medium leading-relaxed italic">
                                                {authorStats[0]?.[1].count > 15 
                                                    ? "Detected high concentrated authorship focus in this operational branch."
                                                    : "Detected optimal architectural distribution across multiple node operators."}
                                            </p>
                                         </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer area */}
                    {commits.length > 0 && !loading && !error && (
                        <div className="px-8 py-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                                    Analysis_Complete: {commits.length} NODES_INTERCEPTED
                                </span>
                            </div>
                            <a
                                href={`https://github.com/${username}/${repoName}/commits`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl px-8 py-3 text-[10px] flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/10"
                            >
                                View_Full_Archive
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
