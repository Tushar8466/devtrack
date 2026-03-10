"use client";

import Spline from '@splinetool/react-spline';
import { Suspense } from 'react';

export default function NotFoundVisual() {
    return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-black rounded-3xl overflow-hidden border border-white/5 relative">
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4 text-neutral-500">
                    <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                </div>
            }>
                <div className="w-full h-full absolute inset-0">
                    <Spline
                        scene="https://prod.spline.design/ip339P0nzofyai5m/scene.splinecode"
                    />
                </div>
            </Suspense>
        </div>
    );
}
