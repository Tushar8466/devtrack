"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { IconBrandGithub, IconSearch, IconArrowRight } from "@tabler/icons-react";
import { WavyBackground } from "@/components/ui/wavy-background";

export default function AnalyzePage() {
    const [username, setUsername] = useState("");
    const router = useRouter();

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            router.push(`/analyze/${username.trim()}`);
        }
    };

    return (
        <WavyBackground
            backgroundFill="black"
            colors={["#8b5cf6", "#6366f1", "#0ea5e9", "#14b8a6", "#3b82f6"]}
            waveWidth={30}
            containerClassName="min-h-screen flex flex-col items-center justify-center px-4"
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-lg text-center bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl"
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                        <IconBrandGithub className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-2xl tracking-tight">Devtrack</span>
                </div>

                <h1 className="text-4xl font-bold text-white mb-3">
                    Analyze a GitHub Profile
                </h1>
                <p className="text-neutral-300 text-lg mb-10">
                    Enter a GitHub username to scan for AI-generated contribution signals.
                </p>

                <form onSubmit={handleAnalyze} className="flex gap-3">
                    <div className="flex-1 relative">
                        <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. torvalds"
                            className="w-full pl-11 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!username.trim()}
                        className="px-5 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        Analyze
                        <IconArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <p className="text-neutral-500 text-sm mt-5">
                    Only scans public repositories · No code stored · GDPR-friendly
                </p>
            </motion.div>
        </WavyBackground>
    );
}