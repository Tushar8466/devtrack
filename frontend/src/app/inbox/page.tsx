"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Inbox,
    ArrowLeft,
    Trash2,
    Clock,
    User,
    MessageSquare,
    Search,
    Filter,
    ShieldCheck,
    Zap,
    Terminal,
    ChevronRight
} from "lucide-react";
import { useSession } from "next-auth/react";

interface Feedback {
    id: number;
    content: string;
    timestamp: string;
    author: string;
    email?: string | null;
    githubHandle?: string | null;
    avatar?: string | null;
    isVerified?: boolean;
}

export default function InboxPage() {
    const { data: session } = useSession();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        const data = localStorage.getItem("devtrack_feedback");
        if (data) {
            setFeedbacks(JSON.parse(data));
        }
        // Simulate a system scan on load
        const timer = setTimeout(() => setIsScanning(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const deleteFeedback = (id: number) => {
        const updated = feedbacks.filter(f => f.id !== id);
        setFeedbacks(updated);
        localStorage.setItem("devtrack_feedback", JSON.stringify(updated));
    };

    const filteredFeedbacks = feedbacks.filter(f =>
        f.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white selection:bg-violet-500/30 overflow-hidden relative">
            {/* Background Architecture */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.05),transparent_70%)]" />
                <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-cyan-600/5 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <nav className="border-b border-white/5 bg-black/40 backdrop-blur-3xl sticky top-0 z-[100] pt-20">
                <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="group p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all active:scale-95">
                            <ArrowLeft size={20} className="text-neutral-400 group-hover:text-white transition-colors" />
                        </Link>
                        <div>
                            <h1 className="font-black text-2xl md:text-3xl tracking-tighter flex items-center gap-3">
                                <span className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                                    <Inbox className="text-violet-500" size={28} />
                                </span>
                                FEEDBACK_INBOX
                            </h1>
                            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">
                                // Neural Transmission Repository //
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-12">
                        {session && (
                            <div className="hidden sm:flex items-center gap-4 py-2 px-4 bg-white/5 border border-white/5 rounded-2xl">
                                <div className="text-right">
                                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest leading-none mb-1">Authenticated As</div>
                                    <div className="text-sm font-black text-white leading-none tracking-tight">{session.user?.name}</div>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-violet-500/30 overflow-hidden bg-violet-500/10 flex items-center justify-center">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} className="text-violet-400" />
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="hidden lg:flex items-center gap-12">
                            <div className="flex flex-col items-end">
                                <span className="text-3xl font-black text-white">{feedbacks.length}</span>
                                <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Total Nodes</span>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div className="flex flex-col items-end">
                                <span className="text-3xl font-black text-emerald-500">ONLINE</span>
                                <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">System Status</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-20 relative z-10">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-violet-400 transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH ENCRYPTED TRANSMISSIONS..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-mono text-white placeholder:text-neutral-700 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.08] transition-all"
                        />
                    </div>
                    <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-neutral-400 hover:text-white hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>

                {isScanning ? (
                    <div className="flex flex-col items-center justify-center py-40 animate-pulse">
                        <div className="w-16 h-16 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-6" />
                        <p className="text-xs font-mono text-violet-400 uppercase tracking-[0.5em]">Scanning Repository Architecture...</p>
                    </div>
                ) : filteredFeedbacks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 text-center space-y-8 animate-in fade-in zoom-in duration-700">
                        <div className="relative">
                            <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                            <div className="w-24 h-24 rounded-[2.5rem] bg-black border border-white/10 flex items-center justify-center relative z-10">
                                <Inbox size={48} className="text-neutral-800" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">NO TRANSMISSIONS FOUND</h2>
                            <p className="text-neutral-600 text-sm font-mono uppercase tracking-widest">Repository is Currently Silent</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredFeedbacks.map((f, i) => (
                            <div
                                key={f.id}
                                style={{ animationDelay: `${i * 100}ms` }}
                                className="group relative bg-[#050505]/60 border border-white/5 rounded-[2.5rem] p-6 hover:border-violet-500/40 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8 backdrop-blur-sm overflow-hidden"
                            >
                                {/* Card Scanning Effect */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-violet-500/20 to-transparent -translate-x-full group-hover:animate-[scan_3s_linear_infinite]" />

                                <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-violet-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:border-violet-500/30 transition-all duration-700 shadow-inner relative z-10 overflow-hidden">
                                                {f.avatar ? (
                                                    <img src={f.avatar} alt={f.author} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={32} strokeWidth={1} />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-black text-xl md:text-2xl tracking-tighter uppercase text-white group-hover:text-violet-400 transition-colors duration-500">
                                                    {f.author}
                                                </h3>
                                                {f.isVerified ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                                        <ShieldCheck size={10} className="text-emerald-500" />
                                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">VERIFIED_ARCHITECT</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                                                        <Zap size={10} className="text-violet-500 fill-violet-500" />
                                                        <span className="text-[9px] font-black text-violet-500 uppercase tracking-[0.2em]">NEURAL_CONNECTION</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 uppercase tracking-widest border-r border-white/10 pr-4">
                                                    <Clock size={12} className="text-violet-500" />
                                                    {new Date(f.timestamp).toLocaleDateString()}
                                                </span>
                                                {f.isVerified && (
                                                    <Link
                                                        href={`https://github.com/${f.githubHandle || f.author.toLowerCase().replace(/\s+/g, '')}`}
                                                        target="_blank"
                                                        className="text-[11px] font-mono text-violet-400 hover:text-white transition-colors flex items-center gap-2"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                                                        github.com/{f.githubHandle || f.author.toLowerCase().replace(/\s+/g, '')}
                                                    </Link>
                                                )}
                                                {!f.isVerified && (
                                                    <span className="text-[11px] font-mono text-neutral-600 uppercase tracking-widest italic">
                                                        NODE_ID: {f.id.toString().slice(-4)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-neutral-500 hover:text-white hover:bg-violet-500/20 hover:border-violet-500/30 transition-all uppercase tracking-widest">
                                            <Terminal size={14} /> Respond
                                        </button>
                                        <button
                                            onClick={() => deleteFeedback(f.id)}
                                            className="p-3 rounded-xl bg-white/0 hover:bg-red-500/10 text-neutral-700 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                                            title="Purge Transmission"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 relative">
                                    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-violet-500/30 rounded-full group-hover:bg-violet-500 transition-all" />
                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 group-hover:bg-white/[0.04] transition-all">
                                        <p className="text-neutral-400 text-lg leading-relaxed font-medium italic group-hover:text-neutral-200 transition-colors">
                                            "{f.content}"
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse delay-150" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse delay-300" />
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 group/meta cursor-pointer">
                                            <Zap size={14} className="text-amber-500" />
                                            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest group-hover/meta:text-white transition-colors">Neural Priority</span>
                                        </div>
                                        <div className="flex items-center gap-2 group/meta cursor-pointer">
                                            <MessageSquare size={14} className="text-neutral-600" />
                                            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest group-hover/meta:text-white transition-colors">Log Entry: {f.id.toString().slice(-4)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="py-32 text-center relative z-10">
                <div className="w-12 h-1 bg-linear-to-r from-transparent via-violet-500/20 to-transparent mx-auto mb-8" />
                <p className="text-neutral-700 text-[10px] font-mono uppercase tracking-[1em] opacity-50">
                    // END OF TRANSMISSION REPOSITORY //
                </p>
                <div className="mt-12 flex justify-center gap-8">
                    <span className="text-neutral-800 text-[10px] font-mono tracking-widest uppercase italic">0xDE70AC</span>
                    <span className="text-neutral-800 text-[10px] font-mono tracking-widest uppercase italic">SYNC_STABLE</span>
                </div>
            </footer>

            <style jsx>{`
                @keyframes scan {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
