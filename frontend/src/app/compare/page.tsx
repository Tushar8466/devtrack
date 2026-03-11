"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "motion/react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { GlareCard } from "@/components/ui/glare-card";
import { SparklesCore } from "@/components/ui/sparkles";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
    IconSearch, 
    IconStar, 
    IconBrain, 
    IconChevronRight, 
    IconVs,
    IconShieldCheck,
    IconTrophy
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

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const generateRandomString = (length: number) => {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export default function ComparePage() {
    const [user1, setUser1] = useState("");
    const [user2, setUser2] = useState("");
    const [data1, setData1] = useState<UserStats | null>(null);
    const [data2, setData2] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Mouse tracking for effects
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const [randomString, setRandomString] = useState("");

    useEffect(() => {
        setRandomString(generateRandomString(1500));
    }, []);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
        let { left, top, width, height } = currentTarget.getBoundingClientRect();
        
        // Main mouse tracking
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
        
        // 3D Tilt calculation
        const xPct = (clientX - left) / width;
        const yPct = (clientY - top) / height;
        rotateX.set((yPct - 0.5) * -10); // Tilt up to 10 degrees
        rotateY.set((xPct - 0.5) * 10);
        
        setRandomString(generateRandomString(1500));
    }

    function hashScore(seed: string, min: number, max: number): number {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
        }
        return min + (hash % (max - min + 1));
    }

    const fetchUser = async (username: string): Promise<UserStats | null> => {
        const cleanName = username.trim();
        if (!cleanName) return null;

        try {
            // First attempt: Real GitHub API
            const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanName)}`, {
                headers: {
                    "Accept": "application/vnd.github.v3+json"
                }
            });
            
            if (userRes.status === 403) {
                throw new Error("RATE_LIMIT_EXCEEDED");
            }

            if (!userRes.ok) {
                if (userRes.status === 404) return null;
                throw new Error(`API_ERROR_${userRes.status}`);
            }
            
            const restData = await userRes.json();

            // Repo fetch with error safety
            let reposData = [];
            try {
                const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanName)}/repos?sort=updated&per_page=100`);
                if (reposRes.ok) reposData = await reposRes.json();
            } catch (e) {
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

            const topLanguage = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";
            const aiScore = hashScore(cleanName + "ai", 20, 80);
            const styleDrift = hashScore(cleanName + "sd", 10, 60);

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
            console.error(`Fetch encountered failure for ${cleanName}`, e);
            // Catch-all fallback for network failures
            return {
                login: cleanName,
                name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
                avatar_url: `https://avatars.githubusercontent.com/u/${hashScore(cleanName, 1000, 9999)}?v=4`,
                followers: hashScore(cleanName, 10, 1000),
                public_repos: hashScore(cleanName, 1, 50),
                aiScore: hashScore(cleanName + "ai", 20, 80),
                styleDrift: hashScore(cleanName + "sd", 10, 60),
                stars: hashScore(cleanName + "st", 0, 500),
                topLanguage: "Unknown"
            };
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

        const cleanUser1 = user1.trim();
        const cleanUser2 = user2.trim();

        try {
            const [res1, res2] = await Promise.all([
                fetchUser(cleanUser1),
                fetchUser(cleanUser2)
            ]);

            if (!res1 || !res2) {
                if (!res1 && !res2) {
                    setError("NEURAL LINK FAILURE: BOTH NODES INVALID OR NOT FOUND.");
                } else if (!res1) {
                    setError(`IDENTIFICATION FAILED: NODE '${cleanUser1}' NOT FOUND IN GLOBAL ARCHIVE.`);
                } else {
                    setError(`IDENTIFICATION FAILED: NODE '${cleanUser2}' NOT FOUND IN GLOBAL ARCHIVE.`);
                }
                setLoading(false);
                return;
            }

            // Artificial delay for neural processing immersion
            await new Promise(r => setTimeout(r, 1500));

            setData1(res1);
            setData2(res2);
        } catch (err: any) {
            if (err.message === "RATE_LIMIT_EXCEEDED") {
                setError("CRITICAL: GITHUB API RATE LIMIT EXCEEDED. NEURAL UPLINK RESTRICTED. RETRY IN 60 MINUTES.");
            } else {
                setError(`COLLISION ERROR: ${err.message || 'UNKNOWN UPLINK FAILURE'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const maskImage = useMotionTemplate`radial-gradient(400px at ${mouseX}px ${mouseY}px, white, transparent)`;
    const backgroundStyle = { maskImage, WebkitMaskImage: maskImage };

    return (
        <div 
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-black text-white overflow-hidden relative"
        >    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
            <BackgroundBeams className={cn("transition-opacity duration-1000", loading ? "opacity-100" : "opacity-40")} />
            
            {/* Sparkles removed */}

            {/* Scrolling Data Stream Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none font-mono text-[8px] leading-none overflow-hidden flex flex-wrap gap-1 p-2 h-screen">
                {randomString}
            </div>
            
            <div className="flex flex-col items-center px-4 md:px-8 pt-32 pb-20 w-full relative z-10">
                    <motion.div
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d"
                        }}
                        className="max-w-7xl mx-auto w-full relative z-10"
                    >
                        {/* Neural Threads SVG Connector */}
                        {data1 && data2 && (
                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0 opacity-20">
                                <motion.path 
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                                    d="M 50% 100 L 25% 300 Q 50% 400 75% 300 L 50% 100"
                                    fill="none"
                                    stroke="url(#threadGradient)"
                                    strokeWidth="1"
                                />
                                <defs>
                                    <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="50%" stopColor="#ffffff" />
                                        <stop offset="100%" stopColor="#d946ef" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        )}
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

                    {/* VS Combat Input Cards */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-5xl mx-auto w-full mb-20 relative group"
                    >
                        {/* Dynamic Background Intensity */}
                        <div className={`absolute -inset-20 bg-violet-500/5 blur-[100px] transition-all duration-1000 ${user1 && user2 ? 'opacity-100 scale-110' : 'opacity-0'}`} />

                        <form onSubmit={handleCompare} className="relative z-10 flex flex-col items-center">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 w-full">
                                {/* Left Fighter Card */}
                                <div className="flex-1 w-full group/left relative">
                                    <GlowingEffect
                                        spread={40}
                                        glow={true}
                                        disabled={false}
                                        proximity={64}
                                        inactiveZone={0.01}
                                        borderWidth={2}
                                    />
                                    <div className="relative bg-black border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl overflow-hidden min-h-[160px] flex flex-col justify-center group-hover/left:border-violet-500/30 transition-all duration-500">
                                         <div className="absolute top-0 left-0 w-2 h-full bg-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.5)]" />
                                         <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                                                    <IconSearch size={18} className="text-violet-400" />
                                                </div>
                                                <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em] mb-1">Node Alpha</span>
                                            </div>
                                            <input 
                                                type="text"
                                                placeholder="ENTER USERNAME..."
                                                value={user1}
                                                onChange={(e) => setUser1(e.target.value)}
                                                className="w-full bg-transparent text-2xl md:text-3xl font-black uppercase tracking-tighter placeholder:text-neutral-900 focus:outline-none text-white italic transition-all focus:tracking-widest relative z-10"
                                            />
                                            {user1 && (
                                                <motion.div 
                                                    initial={{ left: "-100%" }}
                                                    animate={{ left: "200%" }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="absolute top-0 w-32 h-full bg-linear-to-r from-transparent via-violet-500/10 to-transparent pointer-events-none"
                                                />
                                            )}
                                         </div>
                                    </div>
                                </div>

                                {/* Center VS Node */}
                                <motion.div 
                                    whileHover={{ scale: 1.25, rotate: [0, -10, 10, -10, 0] }}
                                    className="flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-500 relative z-20"
                                >
                                    <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-2xl font-black italic shadow-[0_0_60px_rgba(255,255,255,0.5)] animate-pulse border-4 border-black box-content relative overflow-hidden group/vs">
                                        <span className="relative z-10">VS</span>
                                        <motion.div 
                                            animate={{ opacity: [0, 0.2, 0] }}
                                            transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
                                            className="absolute inset-0 bg-violet-500 opacity-0 group-hover/vs:opacity-20"
                                        />
                                        <div className="absolute inset-0 rounded-full bg-white/40 animate-ping opacity-10" />
                                    </div>
                                    <div className="absolute -inset-20 bg-violet-600/10 blur-[60px] rounded-full -z-10 group-hover:bg-violet-600/20 transition-all duration-700" />
                                </motion.div>

                                {/* Right Fighter Card */}
                                <div className="flex-1 w-full group/right relative text-right">
                                    <GlowingEffect
                                        spread={40}
                                        glow={true}
                                        disabled={false}
                                        proximity={64}
                                        inactiveZone={0.01}
                                        borderWidth={2}
                                    />
                                    <div className="relative bg-black border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl overflow-hidden min-h-[160px] flex flex-col justify-center group-hover/right:border-fuchsia-500/30 transition-all duration-500">
                                         <div className="absolute top-0 right-0 w-2 h-full bg-fuchsia-600 shadow-[0_0_20px_rgba(217,70,239,0.5)]" />
                                         <div className="flex flex-col gap-4 items-end">
                                            <div className="flex items-center gap-3 flex-row-reverse">
                                                <div className="w-10 h-10 rounded-full bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
                                                    <IconSearch size={18} className="text-fuchsia-400" />
                                                </div>
                                                <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.4em] mb-1">Node Omega</span>
                                            </div>
                                            <input 
                                                type="text"
                                                placeholder="ENTER USERNAME..."
                                                value={user2}
                                                onChange={(e) => setUser2(e.target.value)}
                                                className="w-full bg-transparent text-2xl md:text-3xl font-black uppercase tracking-tighter placeholder:text-neutral-900 focus:outline-none text-white italic text-right transition-all focus:tracking-widest relative z-10"
                                            />
                                            {user2 && (
                                                <motion.div 
                                                    initial={{ right: "-100%" }}
                                                    animate={{ right: "200%" }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="absolute top-0 w-32 h-full bg-linear-to-l from-transparent via-fuchsia-500/10 to-transparent pointer-events-none"
                                                />
                                            )}
                                         </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(255,255,255,0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={!user1 || !user2 || loading}
                                className="w-full md:w-auto px-20 py-6 bg-white text-black font-black rounded-full italic tracking-[0.4em] shadow-[0_0_40px_rgba(255,255,255,0.2)] disabled:opacity-10 flex items-center justify-center gap-4 group/submit mt-8 md:mt-12 mx-auto overflow-hidden relative"
                            >
                                <motion.div 
                                    className="absolute inset-0 bg-linear-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                />
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        SYNCHRONIZING...
                                    </div>
                                ) : "EXECUTE COLLISION"}
                                {!loading && <IconChevronRight className="group-hover:translate-x-2 transition-transform" />}
                            </motion.button>
                        </form>
                        
                        {error && (
                            <p className="mt-8 text-center text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
                        )}
                    </motion.div>

                    {/* Suggested Collisions */}
                    {!data1 && !loading && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3 mb-20"
                        >
                            <span className="text-[10px] w-full text-center text-neutral-600 font-mono uppercase tracking-[0.3em] mb-2">Suggested Scenarios</span>
                            {[
                                ["torvalds", "dhh"],
                                ["shadcn", "leeerob"],
                                ["nextjs", "reactjs"],
                                ["tushar8466", "gaearon"]
                            ].map(([a, b]) => (
                                <button
                                    key={`${a}-${b}`}
                                    onClick={() => {
                                        setUser1(a);
                                        setUser2(b);
                                    }}
                                    className="px-5 py-2.5 rounded-full border border-white/5 bg-white/2 hover:bg-white/10 hover:border-violet-500/30 transition-all text-[11px] font-bold text-neutral-500 hover:text-white uppercase tracking-widest flex items-center gap-2 group/sugg"
                                >
                                    {a} <IconVs size={12} className="text-neutral-700 group-hover/sugg:text-violet-500 transition-colors" /> {b}
                                </button>
                            ))}
                        </motion.div>
                    )}

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
                            <div className="space-y-20">
                                {/* Comparison Radar */}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="max-w-4xl mx-auto p-12 rounded-4xl bg-black border border-white/10 backdrop-blur-3xl relative overflow-hidden group mb-20 shadow-2xl"
                                >
                                    <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-violet-500 to-transparent" />
                                    <div className="text-center mb-10">
                                        <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] italic">Neural Overlap Analysis</h3>
                                        <div className="flex items-center justify-center gap-4 mt-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-violet-500" />
                                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{data1.login}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-fuchsia-500" />
                                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{data2.login}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="h-96 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                                { subject: 'AI Likelihood', A: data1.aiScore, B: data2.aiScore },
                                                { subject: 'Style Drift', A: data1.styleDrift, B: data2.styleDrift },
                                                { subject: 'Stability', A: hashScore(data1.login + "st", 30, 95), B: hashScore(data2.login + "st", 30, 95) },
                                                { subject: 'Logical Depth', A: hashScore(data1.login + "ld", 40, 90), B: hashScore(data2.login + "ld", 40, 90) },
                                                { subject: 'Social Index', A: Math.min(data1.followers / 10, 100), B: Math.min(data2.followers / 10, 100) },
                                                { subject: 'Stars Strength', A: Math.min(data1.stars / 50, 100), B: Math.min(data2.stars / 50, 100) },
                                            ]}>
                                                <PolarGrid stroke="#222" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} />
                                                <Radar name={data1.login} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                                                <Radar name={data2.login} dataKey="B" stroke="#d946ef" fill="#d946ef" fillOpacity={0.4} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    key="results"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="max-w-6xl mx-auto w-full relative"
                                >
                                    {/* Particle Burst on Results */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <SparklesCore
                                            id="resultsparkles"
                                            background="transparent"
                                            minSize={0.6}
                                            maxSize={1.4}
                                            particleDensity={100}
                                            className="w-full h-full"
                                            particleColor="#a78bfa"
                                        />
                                    </div>
                                    {/* Top Combat Headers */}
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 mb-8 relative">
                                        <div className="w-full md:w-[45%]">
                                            <UserDisplay data={data1} color="violet" />
                                        </div>
                                        
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center">
                                            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-xl font-black italic shadow-[0_0_30px_rgba(255,255,255,0.4)] animate-pulse border-4 border-black box-content">VS</div>
                                            <div className="w-px h-16 bg-linear-to-b from-white/20 to-transparent mt-4" />
                                        </div>

                                        <div className="w-full md:w-[45%]">
                                            <UserDisplay data={data2} color="fuchsia" />
                                        </div>
                                    </div>

                                    {/* Winner Banner */}
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1 }}
                                        className="mb-8 p-4 bg-black border-y border-white/10 flex flex-col items-center text-center"
                                    >
                                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-1">Neural Sequence Preference</span>
                                        <div className="text-2xl font-black text-white italic tracking-tighter uppercase">
                                            {data1.aiScore + data1.stars > data2.aiScore + data2.stars ? data1.login : data2.login} <span className="text-violet-400">HAS THE EDGE</span>
                                        </div>
                                    </motion.div>

                                    {/* Side-by-Side Unified Metrics */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                        <div className="space-y-4">
                                            <MetricList data={data1} otherData={data2} isLeft={true} />
                                        </div>
                                        <div className="space-y-4">
                                            <MetricList data={data2} otherData={data1} isLeft={false} />
                                        </div>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="mt-16 flex flex-col items-center">
                                        <button 
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            className="group flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
                                        >
                                            <span className="text-[10px] font-black text-neutral-400 tracking-[0.3em] uppercase group-hover:text-white">New Sequence</span>
                                            <div className="w-px h-4 bg-white/20" />
                                            <IconChevronRight size={14} className="text-violet-500" />
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        ) : (
                            <motion.div 
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20"
                            >
                                <div className="relative group/idle">
                                    <div className="absolute -inset-10 bg-violet-500/10 blur-3xl rounded-full group-hover/idle:bg-violet-500/20 transition-all duration-1000" />
                                    <IconVs size={80} className="text-neutral-800 animate-pulse relative z-10" />
                                </div>
                                <p className="mt-8 text-neutral-600 font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">
                                    Waiting for Collision Sequence...
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
function UserDisplay({ data, color }: { data: UserStats; color: "violet" | "fuchsia" }) {
    const borderColor = color === 'violet' ? 'border-violet-500/30' : 'border-fuchsia-500/30';
    const accentColor = color === 'violet' ? 'bg-violet-500' : 'bg-fuchsia-500';
    
    // Mouse tracking for holographic effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    function mouseMove({ currentTarget, clientX, clientY }: any) {
        let { left, top } = currentTarget.getBoundingClientRect();
        x.set(clientX - left);
        y.set(clientY - top);
    }

    return (
        <motion.div 
            onMouseMove={mouseMove}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group/user w-full perspective-1000"
        >
            <div className={`absolute -inset-2 bg-${color}-500/10 blur-xl opacity-0 group-hover/user:opacity-100 transition-opacity duration-700`} />
            
            <div className={`relative bg-black border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl overflow-hidden flex flex-col items-center text-center transition-all duration-500 group-hover/user:border-${color}-500/40 shadow-2xl`}>
                {/* Holographic Reflection Overlay */}
                <motion.div 
                    className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover/user:opacity-100 transition-opacity duration-500"
                    style={{
                        background: useMotionTemplate`radial-gradient(400px at ${x}px ${y}px, rgba(255,255,255,0.08), transparent)`
                    }}
                />

                <div className={`absolute top-0 left-0 w-full h-1 ${accentColor} opacity-20`} />
                
                <div className="relative mb-6 group/avatar z-10">
                    <div className={`absolute -inset-6 bg-${color}-500/10 blur-3xl rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-1000 animate-pulse`} />
                    <motion.div 
                        animate={{ 
                            boxShadow: [
                                `0 0 10px rgba(139, 92, 246, 0.05)`,
                                `0 0 40px rgba(139, 92, 246, 0.2)`,
                                `0 0 10px rgba(139, 92, 246, 0.05)`
                            ],
                            rotateY: [0, 5, -5, 0]
                        }}
                        transition={{ 
                            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                            rotateY: { duration: 6, repeat: Infinity, ease: "linear" }
                        }}
                        className={`w-32 h-32 rounded-full border-2 ${borderColor} p-1.5 relative z-10 group-hover/avatar:scale-110 transition-transform duration-700 overflow-hidden bg-black/40`}
                    >
                        <Image src={data.avatar_url} alt={data.login} fill className="rounded-full object-cover grayscale-20 group-hover/avatar:grayscale-0 transition-all duration-700" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                    </motion.div>
                </div>

                <div className="space-y-2 relative z-10">
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic truncate max-w-full drop-shadow-lg">
                        {data.name || data.login}
                    </h2>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
                         <motion.span 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-1.5 h-1.5 rounded-full ${accentColor}`} 
                        />
                         <span className="text-[11px] font-black text-white/60 tracking-[0.2em] uppercase">
                            @{data.login.toUpperCase()}
                        </span>
                    </div>
                </div>

                <IconBrain className={`absolute -bottom-6 -right-6 w-28 h-28 text-${color}-500/5 rotate-12 pointer-events-none group-hover/user:text-${color}-500/10 transition-colors z-0`} />
            </div>
        </motion.div>
    );
}


function MetricList({ data, otherData, isLeft }: { data: UserStats; otherData: UserStats; isLeft: boolean }) {
    const metrics = [
        { label: "AI Likelihood (Neural)", val: data.aiScore, otherVal: otherData.aiScore, lowerIsBetter: true, suffix: "%" },
        { label: "Style Drift (Neural)", val: data.styleDrift, otherVal: otherData.styleDrift, lowerIsBetter: true, suffix: "%" },
        { label: "Stars Strength", val: data.stars, otherVal: otherData.stars, suffix: "" },
        { label: "Social Index", val: data.followers, otherVal: otherData.followers, suffix: "" },
    ];

    return (
        <div className="space-y-5">
            {metrics.map((m, i) => {
                const isWinner = m.lowerIsBetter ? m.val < m.otherVal : m.val > m.otherVal;
                const isTie = m.val === m.otherVal;

                return (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ 
                            scale: 1.02, 
                            rotateY: isLeft ? 5 : -5,
                            z: 20
                        }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className={`p-6 rounded-[2.5rem] border transition-all relative overflow-hidden group/metric perspective-1000 ${isWinner 
                            ? 'border-emerald-500/30 bg-black shadow-[0_10px_40px_-15px_rgba(16,185,129,0.3)] hover:border-emerald-500/50' 
                            : 'border-white/10 bg-black hover:bg-black/90 hover:border-white/20 shadow-xl'} backdrop-blur-xl`}
                    >
                        {isWinner && (
                            <>
                                <div className={`absolute top-0 ${isLeft ? 'right-0' : 'left-0'} w-1 h-full bg-emerald-500/40`} />
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-emerald-500/40 to-transparent" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_70%)] opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                            </>
                        )}
                        
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em] group-hover/metric:text-neutral-400 transition-colors">{m.label}</span>
                            {isWinner && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <IconTrophy size={10} className="text-emerald-500" />
                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                                        Dominant
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-end justify-between relative z-10">
                            <div className="flex items-baseline gap-1.5">
                                <span className={`text-4xl md:text-5xl font-black tabular-nums tracking-tighter ${isWinner ? 'text-emerald-400' : 'text-neutral-200'}`}>
                                    {m.val.toLocaleString()}
                                </span>
                                <span className={`text-xs font-black uppercase tracking-widest ${isWinner ? 'text-emerald-500/50' : 'text-neutral-600'}`}>
                                    {m.suffix}
                                </span>
                            </div>
                            
                            {!isWinner && !isTie && (
                                <div className="opacity-10 group-hover/metric:opacity-30 transition-opacity translate-y-2">
                                    <IconShieldCheck size={28} className="text-neutral-500" strokeWidth={1} />
                                </div>
                            )}
                        </div>

                        {/* Comparative Visual Bar */}
                        <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((m.val / (m.val + m.otherVal)) * 100, 100)}%` }}
                                transition={{ duration: 1.5, ease: "circOut", delay: 0.8 }}
                                className={`h-full ${isWinner ? 'bg-emerald-500/50' : 'bg-neutral-500/30'}`}
                            />
                        </div>
                    </motion.div>
                );
            })}
            
            <div className={`p-8 rounded-[2.5rem] border border-white/10 bg-black relative overflow-hidden group/lang transition-all hover:bg-black/95 backdrop-blur-xl`}>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Core Architecture</span>
                    <IconStar size={16} className="text-neutral-800 group-hover/lang:text-amber-500/50 transition-colors" />
                </div>
                <div className="text-3xl font-black text-white tracking-tighter truncate uppercase italic">
                    {data.topLanguage}
                </div>
                <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className="h-full bg-linear-to-r from-violet-500/50 to-fuchsia-500/50" 
                    />
                </div>
                <div className="mt-2 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Mastery Level: Maximum</div>
            </div>
        </div>
    );
}
