"use client";

import { motion } from "motion/react";
import { ShieldCheck, Zap, User, Clock } from "lucide-react";
import Link from "next/link";

const mockFeedbacks = [
    {
        id: 1,
        content: "The neural scoring accuracy on large-scale Rust repos is impressive. Detects macro-heavy generated code with precision.",
        author: "Rustacean_Alpha",
        githubHandle: "rust-lang",
        isVerified: true,
        avatar: "https://avatars.githubusercontent.com/u/443894?v=4"
    },
    {
        id: 2,
        content: "Proposed addition: Multi-repository collision analysis to detect cross-project style drift.",
        author: "Kernel_Master",
        githubHandle: "torvalds",
        isVerified: true,
        avatar: "https://avatars.githubusercontent.com/u/1024025?v=4"
    },
    {
        id: 3,
        content: "Interface feels clinical and high-performance. Exactly what we need for our audit workflow.",
        author: "Security_Audit_Node",
        isVerified: false
    },
    {
        id: 4,
        content: "DevTrack has simplified our PR review process by flagging high-AI probability commits before human review.",
        author: "Lead_Architect",
        isVerified: true,
        githubHandle: "vercel",
        avatar: "https://avatars.githubusercontent.com/u/14985020?v=4"
    }
];

export function FeedbackWall() {
    return (
        <div className="w-full py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
                    <div className="text-left">
                        <span className="text-violet-400 font-bold uppercase tracking-[0.3em] mb-4 inline-block text-[11px] animate-pulse">// PUBLIC ARCHIVE</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                            COMMUNITY <br />
                            <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">FEEDBACK</span>
                        </h2>
                    </div>
                    <Link 
                        href="/inbox" 
                        className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-xs font-black text-neutral-400 hover:text-white uppercase tracking-widest"
                    >
                        View Full Inbox
                        <div className="w-px h-3 bg-white/20" />
                        <span className="text-violet-500 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockFeedbacks.map((f, i) => (
                        <motion.div
                            key={f.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-black border border-white/5 rounded-3xl p-6 hover:border-violet-500/20 transition-all duration-500 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
                                        {f.avatar ? (
                                            <img src={f.avatar} alt={f.author} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={20} className="text-neutral-600" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-1">{f.author}</div>
                                        <div className="flex items-center gap-1">
                                            {f.isVerified ? (
                                                <ShieldCheck size={10} className="text-emerald-500" />
                                            ) : (
                                                <Zap size={10} className="text-violet-500 fill-violet-500" />
                                            )}
                                            <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">
                                                {f.isVerified ? "Verified" : "Neural Node"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-neutral-400 text-sm leading-relaxed mb-6 italic">
                                    "{f.content}"
                                </p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between opacity-30">
                                <span className="text-[8px] font-mono text-neutral-700 uppercase tracking-widest">#NODE_{f.id}00X</span>
                                <Clock size={10} className="text-neutral-700" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
