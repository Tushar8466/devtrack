"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Vortex } from "@/components/ui/vortex";
import { GlareCard } from "@/components/ui/glare-card";
import { Layers, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/stateful-button";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import Wavy from "@/components/wavy-background";
import { CornerBorders } from "@/components/ui/corner-borders";

const LOADING_STATES = [
    { text: "Initializing analysis engine" },
    { text: "Fetching GitHub profile data" },
    { text: "Synchronizing repositories" },
    { text: "Aggregating pull requests" },
    { text: "Calculating contribution impact" },
    { text: "Generating insights" },
    { text: "Finalizing report" },
];

export default function TrackerSearchPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e?: React.FormEvent | React.MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim() || loading) return;

        const destination = searchQuery.trim();
        setLoading(true);
        // Wait for all steps to complete: steps × duration + small buffer
        await new Promise((resolve) => setTimeout(resolve, LOADING_STATES.length * 500 + 300));
        router.push(`/opensource/track/${destination}`);
    };


    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            <Wavy
                backgroundColor="black"
                rangeY={800}
                particleCount={500}
                baseHue={250}
                containerClassName="h-full w-full min-h-screen overflow-y-auto"
                className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
            >

                <div className="relative z-10 max-w-7xl mx-auto py-20 px-6">
                    <button
                        onClick={() => router.push("/opensource")}
                        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-12 group px-4 py-2 bg-white/5 rounded-xl border border-white/5 backdrop-blur-md"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Overview</span>
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-black/40 backdrop-blur-2xl border border-white/10 p-12 mb-16 relative shadow-2xl group"
                    >
                        <CornerBorders />
                        <div className="relative z-10 flex flex-col items-center py-20">
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-center text-white tracking-tighter uppercase italic mb-6">
                                CONTRIBUTION <br /> <span className="text-glow-violet">ANALYZER</span>
                            </h1>

                            <div className="w-full max-w-lg h-1 relative mb-12">
                                <div className="absolute inset-x-0 top-0 bg-linear-to-r from-transparent via-violet-500 to-transparent h-[2px] w-full blur-sm" />
                                <div className="absolute inset-x-0 top-0 bg-linear-to-r from-transparent via-violet-500 to-transparent h-px w-full" />
                            </div>

                            <p className="text-neutral-400 max-w-xl text-center text-xl mb-16 leading-relaxed font-medium">
                                Analyze your open-source impact. Search any GitHub username to visualize synchronized PRs, issues, and merged contributions.
                            </p>

                            <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
                                <div className="absolute -inset-1 bg-linear-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                <input
                                    type="text"
                                    placeholder="GitHub Username..."
                                    className="relative w-full bg-black/80 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 rounded-2xl px-8 py-6 pl-16 focus:outline-none transition-all text-2xl backdrop-blur-sm placeholder-neutral-600 font-mono text-white shadow-2xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500 w-7 h-7" />
                                <Button
                                    type="button"
                                    onClick={handleSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-violet-600 hover:bg-violet-500 hover:ring-violet-500 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/20 active:scale-95 flex items-center gap-2 text-lg"
                                >
                                    Analyze
                                </Button>
                            </form>

                            <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl px-4">
                                <GlareCard className="flex flex-col items-center justify-center p-8 bg-black/50 overflow-hidden">
                                    <Layers className="w-10 h-10 text-white mb-6" />
                                    <p className="text-2xl font-black text-white mb-2 tracking-tighter uppercase italic">SYNCHRONIZED</p>
                                    <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-[0.2em] text-center">Horizontal Row Alignment</p>
                                </GlareCard>

                                <GlareCard className="flex flex-col items-center justify-center p-8 bg-black/50 overflow-hidden">
                                    <Sparkles className="w-10 h-10 text-violet-400 mb-6" />
                                    <p className="text-2xl font-black text-violet-400 mb-2 tracking-tighter uppercase italic">PREMIUM</p>
                                    <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-[0.2em] text-center">Interactable Glare Cards</p>
                                </GlareCard>

                                <GlareCard className="flex flex-col items-center justify-center p-8 bg-black/50 overflow-hidden">
                                    <Zap className="w-10 h-10 text-indigo-400 mb-6" />
                                    <p className="text-2xl font-black text-white mb-2 tracking-tighter uppercase italic">REAL-TIME</p>
                                    <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-[0.2em] text-center">GitHub API Integration</p>
                                </GlareCard>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Wavy>
            <MultiStepLoader
                loadingStates={LOADING_STATES}
                loading={loading}
                duration={500}
                loop={false}
            />
        </div>
    );
}
