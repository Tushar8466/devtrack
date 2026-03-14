"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="w-full h-full absolute inset-0 z-0 overflow-hidden">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          </div>
        </div>
      }>
        <div className="w-full h-full">
          <Spline
            scene="https://prod.spline.design/zUJ-K2kPmhIKiknU/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </Suspense>
    </div>
  );
}
