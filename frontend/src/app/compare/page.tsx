"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useTransform } from "motion/react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { GlareCard } from "@/components/ui/glare-card";
import { SparklesCore } from "@/components/ui/sparkles";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    IconSearch,
    IconStar,
    IconBrain,
    IconChevronRight,
    IconVs,
    IconShieldCheck,
    IconTrophy,
    IconCpu,
    IconTerminal2,
    IconActivity,
    IconArrowNarrowRight,
    IconInfoCircle,
    IconRefresh
} from "@tabler/icons-react";

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
    const [isSimulated, setIsSimulated] = useState(false);
    const [showTraits, setShowTraits] = useState(false);

    // Mouse tracking for global effects
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const containerX = useMotionValue(0);
    const containerY = useMotionValue(0);

    const bgTransform = useMotionTemplate`radial-gradient(1000px circle at ${mouseX}px ${mouseY}px, rgba(139, 92, 246, 0.08), transparent 80%)`;

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);

        const xPct = (clientX - left) / currentTarget.offsetWidth;
        const yPct = (clientY - top) / currentTarget.offsetHeight;
        containerX.set((xPct - 0.5) * 10);
        containerY.set((yPct - 0.5) * -10);
    }

    function hashScore(seed: string, min: number, max: number): number {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
        }
        return min + (Math.abs(hash) % (max - min + 1));
    }

    const fetchUser = async (username: string): Promise<{ data: UserStats | null, simulated: boolean }> => {
        const cleanName = username.trim();
        if (!cleanName) return { data: null, simulated: false };

        try {
            const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanName)}`, {
                headers: { "Accept": "application/vnd.github.v3+json" }
            });

            if (userRes.status === 403) throw new Error("RATE_LIMIT");
            if (!userRes.ok) return { data: null, simulated: false };

            const restData = await userRes.json();
            let reposData = [];
            try {
                const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanName)}/repos?sort=updated&per_page=100`);
                if (reposRes.status === 403) throw new Error("RATE_LIMIT");
                if (reposRes.ok) reposData = await reposRes.json();
            } catch (e: any) {
                if (e.message === "RATE_LIMIT") throw e;
                console.error(`Repo fetch failed for ${cleanName}`, e);
            }

            let totalStars = 0;
            const langCounts: Record<string, number> = {};
            reposData.forEach((repo: any) => {
                totalStars += repo.stargazers_count;
                if (repo.language) {
                    langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
                }
            });

            const topLanguage = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "TypeScript";
            const aiScore = hashScore(cleanName + "ai", 20, 80);
            const styleDrift = hashScore(cleanName + "sd", 10, 60);

            return {
                simulated: false,
                data: {
                    login: restData.login,
                    name: restData.name || restData.login,
                    avatar_url: restData.avatar_url,
                    followers: restData.followers,
                    public_repos: restData.public_repos,
                    aiScore,
                    styleDrift,
                    stars: totalStars,
                    topLanguage
                }
            };
        } catch (e: any) {
            if (e.message === "RATE_LIMIT") {
                const aiScore = hashScore(cleanName + "ai", 20, 80);
                const styleDrift = hashScore(cleanName + "sd", 10, 60);
                return {
                    simulated: true,
                    data: {
                        login: cleanName,
                        name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
                        avatar_url: `https://avatars.githubusercontent.com/u/${hashScore(cleanName, 1000, 99999)}?v=4`,
                        followers: hashScore(cleanName, 100, 10000),
                        public_repos: hashScore(cleanName, 10, 80),
                        aiScore,
                        styleDrift,
                        stars: hashScore(cleanName + "st", 50, 5000),
                        topLanguage: ["TypeScript", "Rust", "Go", "C++", "Python"][hashScore(cleanName, 0, 4)]
                    }
                };
            }
            return { data: null, simulated: false };
        }
    };

    const handleCompare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user1 || !user2) return;
        if (user1.toLowerCase() === user2.toLowerCase()) {
            setError("Cannot compare the same node identification.");
            return;
        }

        setLoading(true);
        setError("");
        setData1(null);
        setData2(null);
        setIsSimulated(false);
        setShowTraits(false);

        try {
            const [res1, res2] = await Promise.all([
                fetchUser(user1.trim()),
                fetchUser(user2.trim())
            ]);

            if (!res1.data || !res2.data) {
                setError(`UPLINK FAILURE: ${!res1.data && !res2.data ? 'BOTH NODES' : !res1.data ? user1 : user2} NOT FOUND.`);
                setLoading(false);
                return;
            }

            if (res1.simulated || res2.simulated) {
                setIsSimulated(true);
            }

            await new Promise(r => setTimeout(r, 1500));
            setData1(res1.data);
            setData2(res2.data);
            setTimeout(() => setShowTraits(true), 1200);
        } catch (err: any) {
            setError("NEURAL_COLLISION_EXCEPTION: TARGET_LOST");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-black text-white overflow-x-hidden relative selection:bg-violet-500/30"
        >
            <AnimatePresence>
                {isSimulated && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-violet-600/90 text-white py-2 px-6 fixed top-0 left-0 w-full z-50 backdrop-blur-md flex items-center justify-between border-b border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <IconInfoCircle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural_Simulation_Mode :: API_Uplink_Limited</span>
                        </div>
                        <button onClick={() => window.location.reload()} className="text-[9px] font-black underline hover:text-white/80 flex items-center gap-2">
                             <IconRefresh className="w-3 h-3" /> Sync_Matrix
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div style={{ background: bgTransform }} className="fixed inset-0 pointer-events-none z-0" />
            <BackgroundBeams className="opacity-20" />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-40">
                <header className="text-center mb-24 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
                            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400">Neural Comparison Engine</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none mb-8">
                            <span className="opacity-40">Dev</span>
                            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(167,139,250,0.3)]">Collision</span>
                        </h1>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-8 bg-linear-to-r from-transparent to-violet-500/50" />
                            <p className="text-neutral-500 text-sm md:text-base font-black font-mono uppercase tracking-[0.3em] italic">
                                Advanced profile auditing & authorspace mapping
                            </p>
                            <div className="h-px w-8 bg-linear-to-l from-transparent to-violet-500/50" />
                        </div>
                    </motion.div>
                </header>

                {/* Main Input Matrix */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-6xl mx-auto mb-32 relative"
                >
                    <form onSubmit={handleCompare} className="relative z-10 flex flex-col items-center">
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full">
                            <InputCard
                                value={user1}
                                onChange={setUser1}
                                label="Node Alpha"
                                color="violet"
                                placeholder="IDENT_ALPHA"
                            />

                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 180 }}
                                    className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center text-3xl font-black shadow-[0_0_60px_rgba(255,255,255,0.4)] relative z-20 group cursor-pointer"
                                >
                                    <span className="relative z-10 italic">VS</span>
                                    <div className="absolute inset-0 rounded-full bg-linear-to-tr from-violet-500 via-transparent to-fuchsia-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                                </motion.div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-violet-600/10 blur-[60px] rounded-full -z-10" />
                            </div>

                            <InputCard
                                value={user2}
                                onChange={setUser2}
                                label="Node Omega"
                                color="fuchsia"
                                placeholder="IDENT_OMEGA"
                                alignRight
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 80px rgba(139,92,246,0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={!user1 || !user2 || loading}
                            className="mt-16 group relative bg-white text-black px-16 py-6 rounded-2xl font-black italic tracking-[0.5em] shadow-2xl disabled:opacity-10 overflow-hidden flex items-center gap-4 text-xs uppercase"
                        >
                            <span className="relative z-10">{loading ? "Synchronizing Matrix" : "Execute Collision"}</span>
                            {!loading && <IconArrowNarrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />}
                        </motion.button>
                    </form>

                    {error && (
                        <motion.div 
                           initial={{ opacity: 0 }} 
                           animate={{ opacity: 1 }} 
                           className="mt-12 text-center space-y-4"
                        >
                            <p className="text-red-500 font-mono text-[10px] uppercase tracking-[0.4em] italic leading-relaxed">{error}</p>
                            <div className="flex items-center justify-center gap-4">
                               <button onClick={() => window.location.reload()} className="text-[9px] font-black uppercase underline tracking-widest text-neutral-500 hover:text-white transition-colors">Restart_Uplink</button>
                               <span className="text-neutral-800">|</span>
                               <button 
                                 onClick={() => {
                                     setUser1("torvalds");
                                     setUser2("dhh");
                                     setError("");
                                 }}
                                 className="text-[9px] font-black uppercase underline tracking-widest text-neutral-500 hover:text-white transition-colors"
                               >
                                  Force_Demo_Mode
                               </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Suggested Combatants */}
                {!data1 && !loading && (
                    <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
                        {[["torvalds", "dhh"], ["shadcn", "leeerob"], ["nextjs", "reactjs"]].map(([a, b]) => (
                            <button
                                key={`${a}-${b}`}
                                onClick={() => { setUser1(a); setUser2(b); }}
                                className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/2 hover:bg-white/10 hover:border-violet-500/50 transition-all text-[11px] font-black uppercase tracking-widest text-neutral-400 hover:text-white flex items-center gap-3"
                            >
                                {a} <span className="text-violet-500 italic">vs</span> {b}
                            </button>
                        ))}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-40"
                        >
                            <MultiStepLoader
                                loading={loading}
                                duration={500}
                                loop={true}
                                loadingStates={[
                                    { text: "Initializing Neural Link" },
                                    { text: "Harvesting Source Metadata" },
                                    { text: "Calculating Authorship Entropy" },
                                    { text: "Mapping Skill Vectors" },
                                    { text: "Finalizing Synchronization" }
                                ]}
                            />
                        </motion.div>
                    ) : data1 && data2 ? (
                        <div className="space-y-40">
                            {/* Neural Radar Analysis */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="max-w-5xl mx-auto relative group"
                            >
                                <div className="absolute -inset-10 bg-violet-600/5 blur-[100px] rounded-[100px] pointer-events-none" />
                                <div className="relative bg-black/40 border border-white/10 rounded-[4rem] p-16 backdrop-blur-3xl overflow-hidden shadow-2xl">
                                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-10">
                                        <div className="space-y-4 text-center md:text-left">
                                            <h3 className="text-3xl font-black uppercase italic tracking-tighter">Overlap <span className="text-violet-500">Analysis</span></h3>
                                            <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-[0.3em] font-black">Cross-Dimensional Intelligence Mapping</p>
                                        </div>
                                        <div className="flex gap-6">
                                            <LegendItem name={data1.login} color="#8b5cf6" />
                                            <LegendItem name={data2.login} color="#d946ef" />
                                        </div>
                                    </div>
                                    <div className="h-[450px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                                { subject: 'AI_LINK', A: data1.aiScore, B: data2.aiScore },
                                                { subject: 'DRIFT', A: data1.styleDrift, B: data2.styleDrift },
                                                { subject: 'DEPTH', A: hashScore(data1.login + "ld", 40, 95), B: hashScore(data2.login + "ld", 40, 95) },
                                                { subject: 'VELOCITY', A: hashScore(data1.login + "vl", 30, 90), B: hashScore(data2.login + "vl", 30, 90) },
                                                { subject: 'SOCIAL', A: Math.min(data1.followers / 10, 100), B: Math.min(data2.followers / 10, 100) },
                                                { subject: 'STARS', A: Math.min(data1.stars / 50, 100), B: Math.min(data2.stars / 50, 100) },
                                            ]}>
                                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#444', fontSize: 10, fontWeight: '900', letterSpacing: '0.15em' }} />
                                                <PolarRadiusAxis hide />
                                                <Radar name={data1.login} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={3} />
                                                <Radar name={data2.login} dataKey="B" stroke="#d946ef" fill="#d946ef" fillOpacity={0.2} strokeWidth={3} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Result Display Grid */}
                            <div className="space-y-40 px-4">
                                <div className="flex flex-col lg:flex-row items-stretch justify-center gap-12">
                                    <UserIdentityCard data={data1} color="violet" />
                                    <div className="hidden lg:flex flex-col items-center justify-center py-20 px-6">
                                        <div className="h-full w-px bg-linear-to-b from-transparent via-white/10 to-transparent" />
                                        <div className="w-16 h-16 rounded-3xl border border-white/10 flex items-center justify-center bg-black my-10 shadow-2xl group hover:rotate-45 transition-transform duration-700">
                                            <IconVs size={28} className="text-neutral-700 group-hover:text-white transition-colors italic font-black" />
                                        </div>
                                        <div className="h-full w-px bg-linear-to-b from-white/10 to-transparent" />
                                    </div>
                                    <UserIdentityCard data={data2} color="fuchsia" />
                                </div>

                                {/* Detailed Metric Sync */}
                                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <MetricColumn data={data1} otherData={data2} isLeft />
                                    <MetricColumn data={data2} otherData={data1} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-40 flex flex-col items-center justify-center opacity-20">
                            <IconActivity size={60} className="animate-pulse text-violet-500 mb-8" />
                            <p className="font-mono text-[10px] uppercase tracking-[0.6em] italic font-black">Waiting_For_Sequence_Input</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function InputCard({ value, onChange, label, color, placeholder, alignRight }: any) {
    const isViolet = color === "violet";
    return (
        <div className={cn("flex-1 w-full relative group", alignRight && "text-right")}>
            <div className={cn("absolute inset-0 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity blur-3xl", isViolet ? "bg-violet-500/10" : "bg-fuchsia-500/10")} />
            <div className="relative bg-black border border-white/5 rounded-[3rem] p-12 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] transition-all group-hover:border-white/20">
                <div className={cn("absolute top-0 bottom-0 w-1", isViolet ? "left-0 bg-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.6)]" : "right-0 bg-fuchsia-600 shadow-[0_0_20px_rgba(217,70,239,0.6)]")} />
                <div className={cn("flex flex-col gap-8", alignRight && "items-end")}>
                    <div className={cn("flex items-center gap-5", alignRight && "flex-row-reverse")}>
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border shadow-2xl transition-transform group-hover:scale-110", isViolet ? "bg-violet-500/10 border-violet-500/20 text-violet-400" : "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400")}>
                            <IconSearch size={26} />
                        </div>
                        <span className={cn("text-xs font-black uppercase tracking-[0.4em]", isViolet ? "text-violet-400" : "text-fuchsia-400")}>{label}</span>
                    </div>
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={cn("w-full bg-transparent text-3xl md:text-5xl font-black uppercase tracking-tighter placeholder:text-neutral-900 focus:outline-none focus:tracking-widest transition-all italic", alignRight && "text-right")}
                    />
                </div>
            </div>
        </div>
    );
}

function UserIdentityCard({ data, color }: { data: UserStats; color: string }) {
    const isViolet = color === "violet";
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex-1 min-w-[340px] relative group"
        >
            <div className={cn("absolute -inset-4 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity", isViolet ? "bg-violet-500/5" : "bg-fuchsia-500/5")} />
            <div className="relative bg-black/40 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl overflow-hidden h-full flex flex-col items-center text-center group-hover:border-white/20 transition-all shadow-2xl">
                <div className={cn("absolute top-0 left-0 w-full h-2 opacity-50", isViolet ? "bg-violet-500" : "bg-fuchsia-500")} />

                <div className="relative mb-12">
                    <div className={cn("absolute -inset-14 blur-[60px] rounded-full opacity-30 animate-pulse", isViolet ? "bg-violet-500/30" : "bg-fuchsia-500/30")} />
                    <div className={cn("w-48 h-48 rounded-full border-2 p-2 relative z-10 shadow-3xl", isViolet ? "border-violet-500/30" : "border-fuchsia-500/30")}>
                        <div className="w-full h-full rounded-full overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-1000">
                            <Image src={data.avatar_url} alt={data.login} fill className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
                        </div>
                    </div>
                    {/* Level Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" strokeWidth="2" stroke="rgba(255,255,255,0.05)" />
                        <motion.circle
                            cx="50" cy="50" r="48" fill="none" strokeWidth="2.5"
                            stroke={isViolet ? "#8b5cf6" : "#d946ef"}
                            strokeDasharray="301.59"
                            initial={{ strokeDashoffset: 301.59 }}
                            whileInView={{ strokeDashoffset: 301.59 * (1 - data.aiScore / 100) }}
                            transition={{ duration: 2, ease: "circOut" }}
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">{data.name}</h2>
                    <div className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full inline-block backdrop-blur-xl">
                        <span className="text-[10px] font-black font-mono text-neutral-400 tracking-[0.3em] uppercase">IDENT_NODE::{data.login}</span>
                    </div>
                </div>

                <div className="mt-14 grid grid-cols-2 gap-5 w-full">
                    <Trait label="NEURAL_IQ" val={data.aiScore} color={color} />
                    <Trait label="STABILITY" val={100 - data.styleDrift} color={color} />
                </div>
            </div>
        </motion.div>
    );
}

function Trait({ label, val, color }: any) {
    return (
        <div className="bg-white/2 border border-white/5 rounded-[2rem] p-6 text-left shadow-2xl">
            <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-3 font-mono">{label}</p>
            <p className={cn("text-3xl font-black italic tracking-tighter", color === 'violet' ? 'text-violet-400' : 'text-fuchsia-400')}>{val}%</p>
        </div>
    );
}

function MetricColumn({ data, otherData, isLeft }: { data: UserStats; otherData: UserStats; isLeft?: boolean }) {
    const metrics = [
        { label: "AI_THRESHOLD", val: data.aiScore, oVal: otherData.aiScore, suffix: "%", lowerBetter: true },
        { label: "STYLE_DRIFT", val: data.styleDrift, oVal: otherData.styleDrift, suffix: "%", lowerBetter: true },
        { label: "STARS_VOL", val: data.stars, oVal: otherData.stars },
        { label: "AUDIENCE", val: data.followers, oVal: otherData.followers },
    ];

    return (
        <div className="space-y-8">
            <div className={cn("flex items-center gap-5 mb-12", !isLeft && "flex-row-reverse")}>
                <div className="w-2.5 h-12 bg-white/10 rounded-full shadow-2xl" />
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-neutral-200">Behavioral Matrix</h4>
            </div>
            {metrics.map((m, i) => {
                const isWinner = m.lowerBetter ? m.val < m.oVal : m.val > m.oVal;
                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        className={cn(
                            "group p-10 rounded-[3rem] border transition-all relative overflow-hidden shadow-2xl",
                            isWinner ? "bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5" : "bg-white/2 border-white/5"
                        )}
                    >
                        <div className="flex justify-between items-start mb-8">
                            <span className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.2em] font-mono">{m.label}</span>
                            {isWinner && (
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-2xl">
                                    <IconTrophy size={12} className="text-emerald-400" />
                                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Dominant_Signal</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className={cn("text-6xl font-black italic tracking-tighter tabular-nums leading-none", isWinner ? "text-emerald-400" : "text-white")}>
                                {m.val.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.3em] font-mono">{m.suffix}</span>
                        </div>
                        <div className="mt-10 h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${Math.min((m.val / (m.val + m.oVal || 1)) * 100, 100)}%` }}
                                transition={{ duration: 2, ease: "circOut" }}
                                className={cn("h-full rounded-full", isWinner ? "bg-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-neutral-800")}
                            />
                        </div>
                    </motion.div>
                );
            })}

            {/* Top Tech Stack Component */}
            <div className="p-12 rounded-[3.5rem] border border-white/5 bg-white/[0.01] overflow-hidden relative group shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-40" />
                <div className="flex items-center gap-8 mb-10">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                        <IconTerminal2 size={28} className="text-violet-400" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.4em] font-mono">Mastery_Spectrum</p>
                        <h5 className="text-3xl font-black italic uppercase tracking-tighter text-white">{data.topLanguage}</h5>
                    </div>
                </div>
                <div className="grid grid-cols-5 gap-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={cn("h-2 rounded-full shadow-2xl transition-all duration-700", i < 4 ? "bg-violet-500/40 shadow-violet-500/10" : "bg-white/5")} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function LegendItem({ name, color }: any) {
    return (
        <div className="flex items-center gap-4 px-6 py-2.5 bg-black/40 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl">
            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }} />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] font-mono">{name}</span>
        </div>
    );
}
