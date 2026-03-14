"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

export default function BotAgent() {
  return (
    <div className="w-full h-full relative">
      <Suspense fallback={
        <div className="w-full h-full bg-black/5 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        </div>
      }>
        <div className="w-full h-full">
          <Spline
            scene="https://prod.spline.design/NqYZrP8lqH1iOMRr/scene.splinecode" 
            className="w-full h-full"
          />
        </div>
      </Suspense>
    </div>
  );
}
