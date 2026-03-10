"use client";

import Spline from '@splinetool/react-spline';
import { Suspense, useState } from 'react';

export default function Globe() {
    const [hasError, setHasError] = useState(false);

    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-950/50 rounded-3xl overflow-hidden border border-white/5 relative">
            {hasError ? (
                <div className="text-center p-8">
                    <p className="text-red-400 text-sm font-medium">Unable to load interactive ecosystem.</p>
                    <p className="text-neutral-500 text-xs mt-2">Check your internet connection or browser support for WebGL.</p>
                </div>
            ) : (
                <Suspense fallback={
                    <div className="flex flex-col items-center gap-4 text-neutral-500">
                        <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                        <p className="text-xs font-medium uppercase tracking-widest animate-pulse text-violet-400/60">Detecting Global Nodes...</p>
                    </div>
                }>
                    <div className="w-full h-full absolute inset-0">
                        <Spline
                            scene="https://prod.spline.design/pr4xjRJoPwHMjp2Z/scene.splinecode"
                            onError={() => setHasError(true)}
                        />
                    </div>

                    {/* Subtle overlay to ensure the globe feels integrated */}
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
                </Suspense>
            )}

            {/* Interactive Label */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] z-20 pointer-events-none">
                Live Ecosystem Visualization
            </div>
        </div>
    );
}
