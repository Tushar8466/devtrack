"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
    IconSearch, 
    IconArrowLeft, 
    IconUsers, 
    IconStar, 
    IconGitFork, 
    IconBrain, 
    IconChevronRight, 
    IconX,
    IconVs
} from "@tabler/icons-react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import Image from "next/image";

interface UserStats {
    login: string;
    name: string;
    avatar_url: string;
    followers: number;
    public_repos: number;
    aiScore: number;
    styleDrift: number;
    stars: number;
    topLanguage: string;
}

export default function ComparePage() {
    const [user1, setUser1] = useState("");
    const [user2, setUser2] = useState("");
    const [data1, setData1] = useState<UserStats | null>(null);
    const [data2, setData2] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // Deterministic pseudo-score based on username string (mirroring ProfileResults)
    function hashScore(seed: string, min: number, max: number): number {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
        }
        return min + (hash % (max - min + 1));
    }

    const fetchUser = async (username: string): Promise<UserStats | null> => {
        try {
            const userRes = await fetch(`https://api.github.com/users/${username}`);
            if (!userRes.ok) return null;
            const restData = await userRes.json();

            const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
            const reposData = reposRes.ok ? await reposRes.json() : [];

            let totalStars = 0;
            const langCounts: Record<string, number> = {};
            reposData.forEach((repo: any) => {
                totalStars += repo.stargazers_count;
                if (repo.language) {
                    langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
                }
            });

            const topLanguage = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

            const aiScore = hashScore(username + "ai", 20, 80);
            const styleDrift = hashScore(username + "sd", 10, 60);

            return {
                login: restData.login,
                name: restData.name || restData.login,
                avatar_url: restData.avatar_url,
                followers: restData.followers,
                public_repos: restData.public_repos,
                aiScore,
                styleDrift,
                stars: totalStars,
                topLanguage
            };
        } catch (e) {
            return null;
        }
    };

    const handleCompare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user1 || !user2) return;
        if (user1.toLowerCase() === user2.toLowerCase()) {
            setError("Cannot compare the same user.");
            return;
        }

        setLoading(true);
        setError("");
        setData1(null);
        setData2(null);

        const [res1, res2] = await Promise.all([
            fetchUser(user1),
            fetchUser(user2)
        ]);

        if (!res1 || !res2) {
            setError(!res1 && !res2 ? "Both users not found." : !res1 ? `User '${user1}' not found.` : `User '${user2}' not found.`);
            setLoading(false);
            return;
        }

        setData1(res1);
        setData2(res2);
        setLoading(false);
    };

    const getWinner = (val1: number, val2: number, lowerIsBetter: boolean = false) => {
        if (val1 === val2) return null;
        if (lowerIsBetter) return val1 < val2 ? 1 : 2;
        return val1 > val2 ? 1 : 2;
    };

    return (
        <div className="min-h-screen bg-black text-white px-4 md:px-8 pt-32 pb-20 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.08),transparent_70%)] pointer-events-none" />
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                            DEVELOPER <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">COLLISION</span>
                        </h1>
                        <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                            Side-by-side neural analysis of GitHub authorship profiles. 
                            Compare metrics, AI scores, and contribution patterns.
                        </p>
                    </motion.div>
                </div>

                {/* Search Box */}
                <motion.form 
                    onSubmit={handleCompare}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-[2.5rem] p-4 backdrop-blur-3xl shadow-2xl mb-20 group"
                >
                    <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr,auto] items-center gap-4">
                        <div className="relative">
                            <IconSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5 group-focus-within:text-violet-400" />
                            <input 
                                type="text"
                                placeholder="First Developer..."
                                value={user1}
                                onChange={(e) => setUser1(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold uppercase tracking-widest placeholder:text-neutral-700 focus:outline-none focus:border-violet-500/50 transition-all"
                            />
                        </div>

                        <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500 font-black italic">VS</div>
                        </div>

                        <div className="relative">
                            <IconSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5 group-focus-within:text-fuchsia-400" />
                            <input 
                                type="text"
                                placeholder="Second Developer..."
                                value={user2}
                                onChange={(e) => setUser2(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold uppercase tracking-widest placeholder:text-neutral-700 focus:outline-none focus:border-fuchsia-500/50 transition-all"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={!user1 || !user2 || loading}
                            className="bg-white text-black font-black px-10 py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 uppercase tracking-widest text-xs flex items-center gap-2"
                        >
                            Initiate Collision
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-xs mt-4 px-4 font-bold uppercase tracking-widest">{error}</p>}
                </motion.form>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <MultiStepLoader 
                                loading={loading}
                                duration={400}
                                loop={true}
                                loadingStates={[
                                    { text: "Synchronizing with Global Node" },
                                    { text: "Extracting Author A Metadata" },
                                    { text: "Extracting Author B Metadata" },
                                    { text: "Calculating Neural Coefficients" },
                                    { text: "Resolving Ownership Delta" }
                                ]}
                            />
                        </motion.div>
                    ) : data1 && data2 ? (
                        <motion.div 
                            key="results"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-start"
                        >
                            {/* User 1 Card */}
                            <div className="space-y-8 order-1">
                                <UserDisplay data={data1} color="violet" />
                                <MetricList data={data1} otherData={data2} isLeft={true} />
                            </div>

                            {/* Center VS Divider for Mobile/Desktop */}
                            <div className="flex flex-col items-center justify-start pt-20 md:order-2 order-2">
                                <div className="sticky top-40 flex flex-col items-center group">
                                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-3xl font-black italic shadow-[0_0_50px_rgba(139,92,246,0.3)] animate-pulse">VS</div>
                                    <div className="mt-8 space-y-2 text-center opacity-40 group-hover:opacity-100 transition-opacity">
                                        <div className="text-[10px] font-mono uppercase tracking-[0.5em]">Neural Parity</div>
                                        <div className="w-px h-20 bg-linear-to-b from-violet-500 via-fuchsia-500 to-transparent mx-auto" />
                                    </div>
                                </div>
                            </div>

                            {/* User 2 Card */}
                            <div className="space-y-8 order-3 md:order-3">
                                <UserDisplay data={data2} color="fuchsia" />
                                <MetricList data={data2} otherData={data1} isLeft={false} />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 opacity-20 filter grayscale"
                        >
                            <IconVs size={120} strokeWidth={1} />
                            <p className="mt-8 font-mono uppercase tracking-[1em] text-xs">Waiting for Input...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function UserDisplay({ data, color }: { data: UserStats; color: "violet" | "fuchsia" }) {
    const shadowColor = color === 'violet' ? 'shadow-violet-500/20' : 'shadow-fuchsia-500/20';
    const borderColor = color === 'violet' ? 'border-violet-500/30' : 'border-fuchsia-500/30';
    const textColor = color === 'violet' ? 'text-violet-400' : 'text-fuchsia-400';

    return (
        <div className={`p-8 rounded-[3rem] bg-white/5 border ${borderColor} backdrop-blur-md relative overflow-hidden group shadow-2xl`}>
            <div className={`absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-${color}-500 to-transparent opacity-50`} />
            <div className="flex flex-col items-center text-center relative z-10">
                <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-${color}-500/20 blur-3xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className={`w-32 h-32 rounded-full border-2 ${borderColor} p-1 relative z-10 group-hover:scale-105 transition-transform duration-700`}>
                        <Image src={data.avatar_url} alt={data.login} fill className="rounded-full object-cover" />
                    </div>
                </div>
                <h2 className="text-3xl font-black tracking-tighter mb-1">{data.name}</h2>
                <p className={`${textColor} font-mono tracking-widest text-[10px] uppercase`}>@{data.login}</p>
            </div>
        </div>
    );
}

function MetricList({ data, otherData, isLeft }: { data: UserStats; otherData: UserStats; isLeft: boolean }) {
    const metrics = [
        { label: "AI Likelihood", val: data.aiScore, otherVal: otherData.aiScore, lowerIsBetter: true, suffix: "%" },
        { label: "Style Drift", val: data.styleDrift, otherVal: otherData.styleDrift, lowerIsBetter: true, suffix: "%" },
        { label: "Total Stars", val: data.stars, otherVal: otherData.stars, suffix: "" },
        { label: "Followers", val: data.followers, otherVal: otherData.followers, suffix: "" },
        { label: "Public Repos", val: data.public_repos, otherVal: otherData.public_repos, suffix: "" },
    ];

    return (
        <div className="space-y-4">
            {metrics.map((m, i) => {
                const isWinner = m.lowerIsBetter ? m.val < m.otherVal : m.val > m.otherVal;
                const isTie = m.val === m.otherVal;

                return (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className={`p-6 rounded-3xl border ${isWinner ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 bg-white/2'} transition-all group relative overflow-hidden`}
                    >
                        {isWinner && (
                            <div className={`absolute top-0 ${isLeft ? 'right-0' : 'left-0'} w-1 h-full bg-emerald-500/50`} />
                        )}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">{m.label}</span>
                            {isWinner && (
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                    Dominant <IconChevronRight size={10} className={isLeft ? "" : "rotate-180"} />
                                </span>
                            )}
                        </div>
                        <div className="flex items-end gap-2 text-3xl font-black">
                            {m.val.toLocaleString()}{m.suffix}
                            {isTie && <span className="text-xs text-neutral-600 mb-1.5 uppercase tracking-widest">Parity</span>}
                        </div>
                    </motion.div>
                );
            })}
            
            <div className="p-6 rounded-3xl border border-white/5 bg-white/2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">Core Architecture</span>
                <div className="text-xl font-black mt-2 text-white">
                    {data.topLanguage}
                </div>
            </div>
        </div>
    );
}
