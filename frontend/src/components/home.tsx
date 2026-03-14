"use client";

import Spline from '@splinetool/react-spline/next';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="w-full h-full absolute inset-0 z-0 overflow-hidden bg-black">
      <Suspense fallback={
        <div className="w-full h-full bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
            <div className="text-violet-500/50 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
              Neural Uplink Initializing
            </div>
          </div>
        </div>
      }>
        <Spline
          scene="https://prod.spline.design/zUJ-K2kPmhIKiknU/scene.splinecode"
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
}
