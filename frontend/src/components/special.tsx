"use client";

import Spline from '@splinetool/react-spline';
import { Suspense } from 'react';

export default function SpecialEcosystem() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-black rounded-3xl overflow-hidden border border-white/5 relative">
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4 text-neutral-500">
                    <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                    <p className="text-xs font-medium uppercase tracking-widest animate-pulse text-cyan-400/60">Loading Neural Network...</p>
                </div>
            }>
                <div className="w-full h-full absolute inset-0">
                    <Spline
                        scene="https://prod.spline.design/KS-N-Ym3lCpgDotn/scene.splinecode"
                    />
                </div>
            </Suspense>

            <div className="absolute top-6 left-6 flex flex-col gap-1 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Live Engine Active</span>
                </div>
                <div className="text-[24px] font-black text-white/40 font-mono tracking-tighter">
                    84.2<span className="text-cyan-500/50">TB/s</span>
                </div>
            </div>

            <div className="absolute top-6 right-6 flex flex-col items-end gap-1 z-10 text-right">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Neural Load</span>
                <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-cyan-500/50 animate-[pulse_2s_infinite]" />
                </div>
            </div>

            <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
                <div className="flex flex-col gap-1">
                    <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-cyan-400/80 font-mono uppercase">
                        Vector_Match_Found: 0x82f...
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[11px] text-white font-black uppercase tracking-[0.3em] z-20 pointer-events-none shadow-2xl">
                Neural Analysis Engine <span className="ml-2 text-cyan-400 animate-pulse">v4.0</span>
            </div>
        </div>
    );
}
