"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { IconBrandGithub, IconSearch, IconArrowRight, IconGitCommit } from "@tabler/icons-react";
import { Zap } from "lucide-react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const PROFILE_LOADING_STATES = [
    { text: "Locating GitHub user" },
    { text: "Fetching profile data" },
    { text: "Loading repositories" },
    { text: "Gathering stats" },
];

const COMMITS_LOADING_STATES = [
    { text: "Connecting to GitHub API" },
    { text: "Fetching repository data" },
    { text: "Scanning commit history" },
    { text: "Generating timeline" },
];

const REPO_LOADING_STATES = [
    { text: "Establishing tactical uplink" },
    { text: "Fetching repository metadata" },
    { text: "Analyzing architectural pulse" },
    { text: "Calculating health vectors" },
];

export default function ExplorePage() {
    const [searchType, setSearchType] = useState<'profile' | 'commits' | 'repo'>('profile');
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const query = inputValue.trim();
        if (!query || loading) return;

        if (searchType === 'profile') {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, PROFILE_LOADING_STATES.length * 500 + 300));
            router.push(`/analyze/${query}`);
        } else if (searchType === 'repo') {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, REPO_LOADING_STATES.length * 500 + 300));
            router.push(`/opensource/explorer?q=${encodeURIComponent(query)}`);
        } else {
            let username = "";
            let repo = "";

            try {
                if (query.includes("github.com/")) {
                    const urlObj = new URL(query.startsWith("http") ? query : `https://${query}`);
                    const parts = urlObj.pathname.split("/").filter(Boolean);
                    if (parts.length >= 2) {
                        username = parts[0];
                        repo = parts[1];
                    }
                } else {
                    const parts = query.replace("\\", "/").split(/[\s/]+/).filter(Boolean);
                    if (parts.length >= 2) {
                        username = parts[0];
                        repo = parts[1];
                    }
                }
            } catch (err) {
                // ignore
            }

            if (username && repo) {
                setLoading(true);
                await new Promise((resolve) => setTimeout(resolve, COMMITS_LOADING_STATES.length * 500 + 300));
                router.push(`/explore/commits/${username}/${repo}`);
            } else {
                setError("Please enter a valid username/repo format (e.g., torvalds/linux)");
            }
        }
    };

    return (
        <WavyBackground
            backgroundFill="black"
            colors={["#8b5cf6", "#6366f1", "#0ea5e9", "#14b8a6", "#3b82f6"]}
            waveWidth={30}
            containerClassName="min-h-screen flex flex-col items-center justify-center px-4"
        >
                {/* Satellite Uplink Status */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 mb-8 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md self-center mx-auto w-fit"
                >
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-1 h-3 bg-violet-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 font-mono">Satellite_Uplink: <span className="text-emerald-500">Stable</span></span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-lg text-center bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl relative overflow-hidden group/card"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-violet-500 to-fuchsia-500 opacity-20 group-hover/card:opacity-60 transition-opacity" />
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-8 group cursor-pointer" onClick={() => router.push("/")}>
                        <div className="relative w-12 h-12">
                            <img src="/logo/devtrack-logo.png" alt="DevTrack Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-white font-black text-3xl tracking-tighter uppercase italic">Devtrack</span>
                    </div>

                {/* Search Type Toggle */}
                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-8 w-fit mx-auto overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => { setSearchType('profile'); setError(""); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${searchType === 'profile'
                            ? 'bg-white/10 text-white shadow-sm'
                            : 'text-neutral-500 hover:text-white'
                            }`}
                    >
                        <IconSearch className="w-4 h-4" />
                        Profiles
                    </button>
                    <button
                        type="button"
                        onClick={() => { setSearchType('repo'); setError(""); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${searchType === 'repo'
                            ? 'bg-white/10 text-white shadow-sm'
                            : 'text-neutral-500 hover:text-white'
                            }`}
                    >
                        <Zap className="w-4 h-4" />
                        Node Intel
                    </button>
                    <button
                        type="button"
                        onClick={() => { setSearchType('commits'); setError(""); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${searchType === 'commits'
                            ? 'bg-white/10 text-white shadow-sm'
                            : 'text-neutral-500 hover:text-white'
                            }`}
                    >
                        <IconGitCommit className="w-4 h-4" />
                        Commits
                    </button>
                </div>

                <h1 className="text-4xl font-bold text-white mb-3">
                    {searchType === 'profile' ? "Analyze a Profile" : searchType === 'repo' ? "Node Intelligence" : "Repository Commits"}
                </h1>
                <p className="text-neutral-300 text-lg mb-8">
                    {searchType === 'profile'
                        ? "Enter a GitHub username to scan for AI-generated contribution signals."
                        : searchType === 'repo'
                            ? "Retrieve architectural health and health pulses for any repository."
                            : "Enter a GitHub repository to instantly view its most recent commit history."}
                </p>

                <form onSubmit={handleSearch} className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    if (error) setError("");
                                }}
                                placeholder={searchType === 'profile' ? "e.g. torvalds" : "e.g. torvalds/linux"}
                                className={`w-full pl-11 pr-4 py-3.5 bg-neutral-900 border ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-neutral-700 focus:border-violet-500 focus:ring-violet-500/50'} rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-1 transition-all font-mono`}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="px-5 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-violet-500/20"
                        >
                            {searchType === 'profile' ? 'Analyze' : 'Search'}
                            <IconArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    {error && (
                        <p className="text-red-400 text-sm text-left px-1 animate-in fade-in slide-in-from-top-1">
                            {error}
                        </p>
                    )}
                </form>

                <p className="text-neutral-500 text-sm mt-6">
                    {searchType === 'profile'
                        ? "Only scans public repositories · No code stored · GDPR-friendly"
                        : "Search by username/repo or paste a full GitHub URL"}
                </p>
            </motion.div>
            <MultiStepLoader
                loadingStates={searchType === 'profile' ? PROFILE_LOADING_STATES : COMMITS_LOADING_STATES}
                loading={loading}
                duration={500}
                loop={false}
            />
        </WavyBackground>
    );
}