"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Send, Inbox, ShieldCheck, User } from "lucide-react";
import confetti from "canvas-confetti";
import { useSession } from "next-auth/react";

export function FeedbackForm() {
    const { data: session } = useSession();
    const [name, setName] = useState("");
    const [feedback, setFeedback] = useState("");
    const [sending, setSending] = useState(false);

    // Sync name with session if available
    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        } else if (session?.user?.email) {
            setName(session.user.email.split('@')[0]);
        }
    }, [session]);

    const submitFeedback = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        setSending(true);

        // Simulate transmission
        setTimeout(() => {
            const existing = JSON.parse(localStorage.getItem("devtrack_feedback") || "[]");
            const authorName = session?.user?.name || name.trim() || ("Neural Identity #" + Math.floor(Math.random() * 9000 + 1000));

            const newFeedback = {
                id: Date.now(),
                content: feedback,
                timestamp: new Date().toISOString(),
                author: authorName,
                email: session?.user?.email || null,
                githubHandle: (session as any)?.user?.username || (session as any)?.gh_username || session?.user?.name?.toLowerCase().replace(/\s+/g, '') || null,
                avatar: session?.user?.image || null,
                isVerified: !!session
            };

            localStorage.setItem("devtrack_feedback", JSON.stringify([newFeedback, ...existing]));
            setFeedback("");
            setSending(false);

            // Celebration
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#8b5cf6", "#d946ef", "#06b6d4"]
            });
        }, 1500);
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center mt-24">
            <span className="text-violet-400 font-bold uppercase tracking-[0.3em] mb-4 inline-block text-[11px] animate-pulse">// SYSTEM FEEDBACK</span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
                DRIVE THE <br />
                <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent italic">NEURAL ENGINE</span>
            </h2>
            <p className="text-neutral-500 text-lg mb-16 max-w-xl">
                Your feedback directly influences the evolution of DevTrack. Every transmission is recorded in the central repository.
            </p>

            <form onSubmit={submitFeedback} className="w-full max-w-2xl relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-violet-500/20 to-fuchsia-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
                <div className="relative bg-[#050505] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl space-y-4">

                    <div className="flex items-center gap-4 mb-2">
                        <div className={`flex-1 relative transition-all ${session ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Identity (Name or Alias)..."
                                className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-violet-500/30 transition-all text-sm font-medium pl-12"
                            />
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                        </div>

                        {session && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-violet-500/5 border border-violet-500/20 rounded-xl animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-violet-500/30">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-violet-500/20 flex items-center justify-center text-[10px] font-bold">DT</div>
                                    )}
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] font-mono text-violet-400 uppercase tracking-widest leading-none mb-1">Recognized Identity</div>
                                    <div className="text-sm font-black text-white leading-none">{session.user?.name}</div>
                                </div>
                                <ShieldCheck className="text-emerald-500 ml-2" size={16} />
                            </div>
                        )}
                    </div>

                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Drop your architectural feedback or feature proposals..."
                        className="w-full h-40 bg-white/2 border border-white/5 rounded-2xl p-6 text-white placeholder:text-neutral-700 focus:outline-none focus:border-violet-500/30 transition-all resize-none mb-2 text-lg font-medium"
                    />
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-4 items-center opacity-40">
                            <Zap size={16} className="text-violet-500" />
                            <span className="text-[10px] font-mono tracking-widest text-white uppercase">Encrypted Transmission</span>
                        </div>
                        <button
                            disabled={sending}
                            type="submit"
                            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-sm transition-all shadow-lg ${sending
                                ? "bg-violet-900/50 text-violet-300 cursor-not-allowed"
                                : "bg-white text-black hover:scale-105 active:scale-95 shadow-white/10"
                                }`}
                        >
                            {sending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                    TRANSMITTING...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    SEND TRANSMISSION
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-20 flex flex-col items-center gap-4">
                <p className="text-neutral-600 text-xs uppercase tracking-[0.4em] font-mono">// VIEW COLLECTIVE INTELLIGENCE //</p>
                <Link
                    href="/inbox"
                    className="p-4 rounded-full border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-neutral-500 hover:text-white group"
                >
                    <Inbox size={24} className="group-hover:scale-110 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
