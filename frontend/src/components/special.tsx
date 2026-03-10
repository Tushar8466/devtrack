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

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] z-20 pointer-events-none">
                Neural Analysis Engine
            </div>
        </div>
    );
}
