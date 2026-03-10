"use client";

import Spline from '@splinetool/react-spline';
import { Suspense } from 'react';
import Link from 'next/link';
import { Home, MoveLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* 3D Visual Container */}
            <div className="absolute inset-0 z-0">
                <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                    </div>
                }>
                    <Spline
                        scene="https://prod.spline.design/ip339P0nzofyai5m/scene.splinecode"
                    />
                </Suspense>
            </div>

            {/* Bottom Navigation Card */}
            <div className="absolute bottom-12 z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 group shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)]"
                >
                    <Home size={20} className="group-hover:rotate-12 transition-transform" />
                    BACK TO REALITY
                </Link>
            </div>

        </div>
    );
}
