"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Suspense fallback={<div className="w-full h-full bg-black flex items-center justify-center"><div className="text-white text-xs animate-pulse">Initializing Spline...</div></div>}>
        <div className="w-full h-full">
          <Spline
            scene="https://prod.spline.design/zUJ-K2kPmhIKiknU/scene.splinecode"
            className="w-full h-full opacity-100"
          />
        </div>
      </Suspense>
    </div>
  );
}
