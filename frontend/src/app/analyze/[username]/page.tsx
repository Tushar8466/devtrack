"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfileResults from "@/components/explore/ProfileResults";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { Info, AlertCircle, RefreshCw, Activity, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// MOCK DATA for Fallback (Neural Simulation Mode)
const MOCK_PROFILE = (user: string) => {
    // Generate a deterministic hash for consistent mock results per username
    const hash = (s: string) => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
    const h = Math.abs(hash(user));

    const restData = {
        login: user,
        name: user.charAt(0).toUpperCase() + user.slice(1),
        avatar_url: `https://avatars.githubusercontent.com/u/${(h % 50000)}?v=4`,
        bio: "Strategic Technical Architect specializing in Neural Systems and Distributed Authorship. Identified as high-impact contributor across the global grid.",
        location: ["San Jose, CA", "Berlin, DE", "Singapore", "London, UK", "Tokyo, JP"][h % 5],
        company: "Neural Systems Research",
        blog: "https://devtrack.ai",
        followers: (h % 5000) + 200,
        following: (h % 1000) + 100,
        public_repos: (h % 80) + 15,
        created_at: new Date(2018, h % 12, h % 28).toISOString()
    };

    const baseRepoNames = ["neural-scan", "distributed-consensus", "vortex-ui", "nexus-kernel", "author-pulse", "sentinel-api", "grid-logic", "alpha-protocol"];
    const mappedNodes = baseRepoNames.map((base, i) => {
        const name = `${base}-${h % 100}`;
        return {
            name,
            description: `High-fidelity ${name} module for ${user}'s neural workspace. Architectural optimization enabled.`,
            stargazerCount: (h % 500) + (800 - i * 150),
            forkCount: (h % 100) + (120 - i * 20),
            primaryLanguage: { name: ["TypeScript", "Rust", "Go", "C++", "Python", "Swift"][i % 6], color: "#8b5cf6" },
            updatedAt: new Date().toISOString(),
            url: `https://github.com/${user}/${name}`,
        };
    });

    const graphqlData = {
        name: restData.name,
        bio: restData.bio,
        avatarUrl: restData.avatar_url,
        location: restData.location,
        company: restData.company,
        websiteUrl: restData.blog,
        followers: { totalCount: restData.followers },
        following: { totalCount: restData.following },
        contributionsCollection: {
            contributionCalendar: {
                totalContributions: (h % 8000) + 1200,
            },
        },
        pinnedItems: { nodes: mappedNodes.slice(0, 6) },
        repositories: { nodes: mappedNodes },
    };

    return { rest: restData, graphql: graphqlData };
};

export default function AnalyzeUserPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [isSimulated, setIsSimulated] = useState(false);

    const handleBack = () => {
        router.push("/explore");
    };

    useEffect(() => {
        if (!username) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setIsSimulated(false);

            try {
                // Fetch REST API Data for User with better timeout/error handling
                const userRes = await fetch(`https://api.github.com/users/${username}`, {
                    headers: { "Accept": "application/vnd.github.v3+json" },
                    cache: 'no-store'
                });

                if (userRes.status === 403) {
                    console.warn("GitHub API rate limit exceeded. Activating Neural Simulation.");
                    setProfileData(MOCK_PROFILE(username));
                    setIsSimulated(true);
                    setLoading(false);
                    return;
                }

                if (!userRes.ok) {
                    if (userRes.status === 404) throw new Error("IDENT_NOT_FOUND: User does not exist in G_SPACE.");
                    throw new Error(`UPLINK_ERROR: ${userRes.statusText || 'G_DATABASE_UNREACHABLE'}`);
                }
                const restData = await userRes.json();

                // Fetch Repositories
                const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { cache: 'no-store' });
                if (reposRes.status === 403) {
                    const mock = MOCK_PROFILE(username);
                    setProfileData({ rest: restData, graphql: { ...mock.graphql, name: restData.name || username } });
                    setIsSimulated(true);
                    setLoading(false);
                    return;
                }
                const reposData = reposRes.ok ? await reposRes.json() : [];

                const mappedNodes = reposData.map((repo: any) => ({
                    name: repo.name,
                    description: repo.description,
                    stargazerCount: repo.stargazers_count,
                    forkCount: repo.forks_count,
                    primaryLanguage: repo.language ? { name: repo.language, color: "#8a2be2" } : null,
                    updatedAt: repo.updated_at,
                    url: repo.html_url,
                }));

                const sortedByStars = [...mappedNodes].sort((a: any, b: any) => b.stargazerCount - a.stargazerCount);
                const pinnedNodes = sortedByStars.slice(0, 6);

                const graphqlData = {
                    name: restData.name,
                    bio: restData.bio,
                    avatarUrl: restData.avatar_url,
                    location: restData.location,
                    company: restData.company,
                    websiteUrl: restData.blog,
                    followers: { totalCount: restData.followers },
                    following: { totalCount: restData.following },
                    contributionsCollection: {
                        contributionCalendar: {
                            totalContributions: 0, // Calendar handled by component fetch
                        },
                    },
                    pinnedItems: { nodes: pinnedNodes },
                    repositories: { nodes: mappedNodes },
                };

                setProfileData({ rest: restData, graphql: graphqlData });
            } catch (err: any) {
                setError(err.message || "UPLINK_FAILURE: NEURAL_LINK_STABILITY_LOST");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black relative flex items-center justify-center">
                <MultiStepLoader
                    loadingStates={[
                        { text: "Establishing Neural Uplink" },
                        { text: "Intercepting Source Profile" },
                        { text: "Harvesting Node Repositories" },
                        { text: "Analyzing Behavioral DNA" },
                        { text: "Mapping Skill Vectors" },
                    ]}
                    loading={loading}
                    duration={800}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-8 relative overflow-hidden">
                <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.05),transparent)] pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-xl z-10"
                >
                    <div className="relative inline-block mb-10">
                        <div className="absolute -inset-10 bg-red-600/10 blur-[60px] rounded-full animate-pulse" />
                        <div className="w-24 h-24 rounded-4xl bg-black border border-red-500/20 flex items-center justify-center relative z-10 mx-auto">
                            <AlertCircle className="text-red-500 w-10 h-10 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    <h2 className="text-5xl font-black text-white mb-4 uppercase italic tracking-tighter">
                        Analysis <span className="text-red-500">Failed</span>
                    </h2>

                    <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 mb-10 backdrop-blur-xl">
                        <p className="text-neutral-400 font-mono text-xs uppercase tracking-[0.2em] leading-relaxed mb-6">
                            SYSTEM_ALERT // UPLINK_LOST: {error}
                        </p>
                        <div className="flex items-center justify-center gap-4 text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                            <Activity className="w-3 h-3 text-red-700" />
                            <span>Neural stability at 0.0%</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleBack}
                            className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Return to Command
                        </button>
                        <button
                            onClick={() => {
                                setProfileData(MOCK_PROFILE(username));
                                setIsSimulated(true);
                                setError(null);
                            }}
                            className="group flex items-center gap-3 px-8 py-5 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest"
                        >
                            <Terminal className="w-4 h-4 text-violet-500" />
                            Force Simulation
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (profileData) {
        return (
            <div className="relative min-h-screen bg-black">
                <AnimatePresence>
                    {isSimulated && (
                        <motion.div
                            initial={{ y: -60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="fixed top-0 left-0 w-full z-50 bg-violet-600/90 text-white backdrop-blur-md border-b border-white/10"
                        >
                            <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                        Tactical_Simulation_Active // Uplink Failure Met // G_API_LIMIT_TRIPPED
                                    </span>
                                </div>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-[9px] font-black uppercase border-b border-white/50 hover:border-white transition-all flex items-center gap-2"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    Restabilize Link
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className={isSimulated ? "pt-10" : ""}>
                    <ProfileResults data={profileData} onBack={handleBack} />
                </div>
            </div>
        );
    }

    return null;
}
