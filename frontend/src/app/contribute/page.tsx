"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Github, Code2, MessageSquare, Coffee, Heart, Globe, Terminal } from "lucide-react";
import { Suspense } from "react";

const Portal = dynamic(() => import("@/components/portal"), {
    ssr: false,
    loading: () => null,
});

export default function ContributePage() {
    const steps = [
        {
            title: "Fork & Clone",
            desc: "Starting point for every contributor. Fetch the source to your local environment.",
            icon: <Terminal className="text-violet-400" />,
            hoverClass: "hover:border-violet-500/40 hover:bg-violet-500/5",
            iconHoverBorder: "group-hover:border-violet-500/50"
        },
        {
            title: "Build the Core",
            desc: "Our neural engine is built with Next.js and Spline. Run npm install to get started.",
            icon: <Code2 className="text-cyan-400" />,
            hoverClass: "hover:border-cyan-500/40 hover:bg-cyan-500/5",
            iconHoverBorder: "group-hover:border-cyan-500/50"
        },
        {
            title: "Ship Features",
            desc: "Pick an issue from our GitHub backlog or propose your own architectural upgrade.",
            icon: <Globe className="text-green-400" />,
            hoverClass: "hover:border-green-500/40 hover:bg-green-500/5",
            iconHoverBorder: "group-hover:border-green-500/50"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-violet-500/30 overflow-x-hidden">
            {/* Header */}
            <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="font-black text-2xl tracking-tighter hover:scale-105 transition-transform">DEVTRACK<span className="text-violet-500">_</span></Link>
                    <a href="https://github.com/Tushar8466/devtrack" target="_blank" rel="noreferrer" className="bg-white text-black px-5 py-2 rounded-full font-black text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        <Github size={18} />
                        Star on GitHub
                    </a>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-24 relative">
                {/* Interactive 3D Background Wrapper */}
                <div className="absolute top-0 right-[-20%] w-full h-[800px] z-0 opacity-40 pointer-events-none grayscale hover:grayscale-0 transition-all duration-1000 hidden lg:block">
                    <Portal />
                </div>

                {/* Hero */}
                <div className="relative z-10 max-w-4xl mb-32 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 inline-block">
                        Open Source Initiative
                    </span>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85]">
                        BECOME AN <br />
                        <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">ARCHITECT</span>
                    </h1>
                    <p className="text-neutral-400 text-xl leading-relaxed max-w-2xl">
                        DevTrack is an open-source movement to define the future of software authorship. We're building the infrastructure to decode developer DNA, and we need your brain at the core.
                    </p>
                </div>

                {/* Contribution Paths */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
                    {steps.map((step, i) => (
                        <div key={i} className={`group p-8 rounded-[2.5rem] bg-white/2 border border-white/5 transition-all duration-500 hover:-translate-y-2 ${step.hoverClass}`}>
                            <div className={`w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-1000 ${step.iconHoverBorder}`}>
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">{step.title}</h3>
                            <p className="text-neutral-500 leading-relaxed text-sm group-hover:text-neutral-300 transition-colors">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Ways to Support */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-4xl font-black mb-12 tracking-tight">WAYS TO SUPPORT</h2>
                            <div className="space-y-6">
                                <div className="flex gap-6 p-6 rounded-4xl bg-white/1 border border-white/5 hover:bg-violet-500/5 hover:border-violet-500/20 transition-all duration-300 group">
                                    <div className="text-violet-400 shrink-0 group-hover:animate-bounce"><MessageSquare size={32} strokeWidth={1.5} /></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Feedback & RFCs</h4>
                                        <p className="text-neutral-500 text-sm leading-relaxed">Join our Discord to discuss the roadmap and share your ideas for new detection algorithms.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 p-6 rounded-4xl bg-white/1 border border-white/5 hover:bg-cyan-500/5 hover:border-cyan-500/20 transition-all duration-300 group">
                                    <div className="text-cyan-400 shrink-0 group-hover:scale-125 transition-transform"><Heart size={32} strokeWidth={1.5} /></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Spread the Word</h4>
                                        <p className="text-neutral-500 text-sm leading-relaxed">Share DevTrack with your team. Knowledge about AI influence is critical in modern engineering.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 p-6 rounded-4xl bg-white/1 border border-white/5 hover:bg-amber-500/5 hover:border-amber-500/20 transition-all duration-300 group">
                                    <div className="text-amber-400 shrink-0 rotate-[-10deg] group-hover:rotate-0 transition-transform"><Coffee size={32} strokeWidth={1.5} /></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Sponsoring</h4>
                                        <p className="text-neutral-500 text-sm leading-relaxed">Financial support helps us keep the high-performance neural engine servers running for everyone.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sticky top-32">
                        <div className="aspect-square rounded-[3.5rem] bg-black border border-white/10 flex flex-col items-center justify-center p-12 text-center group overflow-hidden relative shadow-[0_0_50px_-12px_rgba(124,58,237,0.3)]">
                            {/* Animated Grid Pattern */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] group-hover:scale-110 transition-transform duration-1000" />

                            <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl z-0" />

                            <div className="relative z-10 w-full">
                                <div className="relative inline-block mb-8">
                                    <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000" />
                                    <Github size={120} className="relative z-10 text-white/10 group-hover:text-white transition-all duration-1000 group-hover:scale-110" />
                                </div>

                                <h3 className="text-4xl font-black mb-6 tracking-tighter group-hover:tracking-normal transition-all duration-700">READY TO FORK?</h3>
                                <p className="text-neutral-400 mb-10 text-lg leading-relaxed max-w-xs mx-auto">
                                    Access the codebase, 3D assets, and the CodeBERT engine.
                                </p>

                                <a href="https://github.com/Tushar8466/devtrack" target="_blank" rel="noreferrer" className="block w-full py-5 rounded-2xl bg-white text-black font-black hover:bg-violet-500 hover:text-white transition-all duration-500 shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] uppercase tracking-widest text-sm">
                                    GO TO REPOSITORY
                                </a>
                            </div>

                            {/* Background Glow */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-violet-600/10 blur-[100px] rounded-full group-hover:bg-violet-600/30 transition-all duration-1000" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 px-6 bg-black mt-40">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
                    <div className="flex gap-8 items-center opacity-40 hover:opacity-100 transition-opacity duration-700">
                        <Github size={20} />
                        <Globe size={20} />
                        <Terminal size={20} />
                    </div>
                    <p className="text-neutral-600 text-[10px] font-mono uppercase tracking-[0.5em] text-center">
            // Neural authorship established // Human primary contributor //
                    </p>
                    <Link href="/" className="px-6 py-2 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all text-sm font-medium">
                        Return Home
                    </Link>
                </div>
            </footer>
        </div>
    );
}
