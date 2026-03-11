"use client";

import { motion } from "motion/react";
import { ShieldCheck, Zap, User, Clock, MessageSquare, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

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
    const [feedbacks, setFeedbacks] = useState([...mockFeedbacks]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("devtrack_feedback") || "[]");
        if (stored.length > 0) {
            setFeedbacks(prev => [...stored, ...prev]);
        }
    }, []);

    return (
        <div className="w-full py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
                    <div className="text-left space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                            <span className="text-violet-400 font-black uppercase tracking-[0.4em] text-[10px]">// LIVE_FEEDBACK_ARCHIVE</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
                            COLLECTIVE <br />
                            <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">INTELLIGENCE</span>
                        </h2>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-6 backdrop-blur-md">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Active_Nodes</span>
                            <span className="text-xl font-black text-white italic">{feedbacks.length}</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Network_Status</span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Synchronized
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {feedbacks.map((f, i) => (
                        <motion.div
                            key={f.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative bg-[#050505] border border-white/10 rounded-[2.5rem] p-8 hover:border-violet-500/30 transition-all duration-700 hover:bg-black/80 flex flex-col justify-between shadow-2xl overflow-hidden min-h-[320px]"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Terminal size={12} className="text-violet-500/50" />
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-violet-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center p-0.5">
                                            {f.avatar ? (
                                                <img src={f.avatar} alt={f.author} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                            ) : (
                                                <User size={20} className="text-neutral-700 group-hover:text-violet-400 transition-colors" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[11px] font-black text-white uppercase tracking-tight leading-none mb-1.5 group-hover:text-violet-400 transition-colors">{f.author}</div>
                                        <div className="flex items-center gap-2">
                                            {f.isVerified ? (
                                                <ShieldCheck size={11} className="text-emerald-500" />
                                            ) : (
                                                <Zap size={11} className="text-violet-500 fill-violet-500" />
                                            )}
                                            <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest font-bold">
                                                {f.isVerified ? "Trusted_Node" : "Neural_Trace"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <blockquote className="text-neutral-400 text-[13px] leading-relaxed mb-8 italic font-medium group-hover:text-neutral-300 transition-colors border-l-2 border-white/5 pl-4 py-1">
                                    "{f.content}"
                                </blockquote>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between opacity-30 group-hover:opacity-80 transition-opacity">
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={10} className="text-neutral-600" />
                                    <span className="text-[9px] font-mono text-neutral-700 uppercase tracking-[0.2em]">#SEQ_{String(f.id).slice(-4)}</span>
                                </div>
                                <Clock size={10} className="text-neutral-700" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            
            {/* Background Decorative Element */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>
    );
}
